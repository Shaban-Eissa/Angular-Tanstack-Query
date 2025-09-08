import {
  Component,
  inject,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { injectQuery, injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-repo-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './repo-details.component.html',
})
export class RepoDetailsComponent {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  // Get route parameters as signals
  private params = toSignal(this.route.params, { initialValue: {} });

  owner = computed(() => (this.params() as any)?.['owner'] || '');
  repo = computed(() => (this.params() as any)?.['name'] || '');

  // Query for repository details
  repoQuery = injectQuery(() => ({
    queryKey: ['repo', this.owner(), this.repo()],
    queryFn: async () => {
      const url = `https://api.github.com/repos/${this.owner()}/${this.repo()}`;
      return lastValueFrom(this.http.get<any>(url));
    },
    enabled: () => !!this.owner() && !!this.repo(),
  }));

  // Infinite query for commits
  commitsQuery = injectInfiniteQuery(() => ({
    queryKey: ['commits', this.owner(), this.repo()],
    queryFn: async ({ pageParam = 1 }) => {
      const url = `https://api.github.com/repos/${this.owner()}/${this.repo()}/commits?page=${pageParam}&per_page=15`;
      return lastValueFrom(this.http.get<any[]>(url));
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 15 ? allPages.length + 1 : undefined;
    },
    enabled: () => !!this.owner() && !!this.repo(),
    retry: 1,
    refetchOnWindowFocus: false,
  }));

  allCommits = () => this.commitsQuery.data()?.pages.flat() ?? [];

  formatNumber(num: number): string {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  }

  getRelativeTime(dateString: string): string {
    if (!dateString) return 'unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'today';
    if (diffInDays === 1) return 'yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  }

  getLanguageDotColor(language: string): string {
    const colors: { [key: string]: string } = {
      'JavaScript': 'bg-yellow-400',
      'TypeScript': 'bg-blue-500',
      'Python': 'bg-green-500',
      'Java': 'bg-red-500',
      'Go': 'bg-cyan-500',
      'Rust': 'bg-orange-500',
      'C++': 'bg-purple-500',
      'C#': 'bg-indigo-500',
      'PHP': 'bg-violet-500',
      'Ruby': 'bg-pink-500',
    };
    return colors[language] || 'bg-gray-400';
  }

  getLanguageIconColor(language: string): string {
    return 'text-white';
  }

  getCommitType(message: string): string {
    const commitMessage = message.toLowerCase();
    if (commitMessage.startsWith('feat:') || commitMessage.startsWith('feature:')) return 'feature';
    if (commitMessage.startsWith('fix:')) return 'fix';
    if (commitMessage.startsWith('docs:')) return 'docs';
    if (commitMessage.startsWith('style:')) return 'style';
    if (commitMessage.startsWith('refactor:')) return 'refactor';
    if (commitMessage.startsWith('test:')) return 'test';
    if (commitMessage.startsWith('chore:')) return 'chore';
    if (commitMessage.startsWith('build:')) return 'build';
    if (commitMessage.startsWith('ci:')) return 'ci';
    if (commitMessage.startsWith('perf:')) return 'perf';
    if (commitMessage.includes('fix') || commitMessage.includes('bug') || commitMessage.includes('issue')) return 'fix';
    if (commitMessage.includes('add') || commitMessage.includes('new') || commitMessage.includes('feature')) return 'feature';
    if (commitMessage.includes('doc') || commitMessage.includes('readme')) return 'docs';
    if (commitMessage.includes('refactor') || commitMessage.includes('clean')) return 'refactor';
    if (commitMessage.includes('test')) return 'test';
    if (commitMessage.includes('style') || commitMessage.includes('ui') || commitMessage.includes('css')) return 'style';

    return 'other';
  }

  getRecentActivityStatus(): string {
    if (!this.allCommits().length) return 'No activity';

    const now = new Date();
    const lastCommitDate = new Date(this.allCommits()[0].commit.author.date);
    const diffInDays = Math.floor((now.getTime() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return 'This week';
    if (diffInDays < 30) return 'This month';
    if (diffInDays < 90) return 'Last quarter';
    if (diffInDays < 365) return 'This year';
    return 'Inactive';
  }

  getCommitTypeColor(message: string): string {
    const type = this.getCommitType(message);
    const colors: { [key: string]: string } = {
      'feature': 'bg-green-500',
      'fix': 'bg-red-500',
      'docs': 'bg-blue-500',
      'style': 'bg-purple-500',
      'refactor': 'bg-yellow-500',
      'test': 'bg-cyan-500',
      'chore': 'bg-gray-500',
      'build': 'bg-orange-500',
      'ci': 'bg-indigo-500',
      'perf': 'bg-pink-500',
      'other': 'bg-gray-400'
    };
    return colors[type] || 'bg-gray-400';
  }

  getCommitTypeBadgeClass(message: string): string {
    const type = this.getCommitType(message);
    const classes: { [key: string]: string } = {
      'feature': 'bg-green-500/20 text-green-300 border border-green-500/20',
      'fix': 'bg-red-500/20 text-red-300 border border-red-500/20',
      'docs': 'bg-blue-500/20 text-blue-300 border border-blue-500/20',
      'style': 'bg-purple-500/20 text-purple-300 border border-purple-500/20',
      'refactor': 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/20',
      'test': 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/20',
      'chore': 'bg-gray-500/20 text-gray-300 border border-gray-500/20',
      'build': 'bg-orange-500/20 text-orange-300 border border-orange-500/20',
      'ci': 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20',
      'perf': 'bg-pink-500/20 text-pink-300 border border-pink-500/20',
      'other': 'bg-gray-500/20 text-gray-300 border border-gray-500/20'
    };
    return classes[type] || classes['other'];
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
