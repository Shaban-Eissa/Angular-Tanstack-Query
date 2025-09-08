import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { GithubRepoCardComponent } from '../github-repo-card/github-repo-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, GithubRepoCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private http = inject(HttpClient);

  username = '';
  searchSignal = signal('');
  popularUsers = ['angular', 'microsoft', 'google', 'facebook', 'vercel', 'nodejs', 'typescript'];

  onSearch(event: Event) {
    event.preventDefault();
    if (this.username.trim()) {
      this.searchSignal.set(this.username.trim());
    }
  }

  setUsername(username: string) {
    this.username = username;
    this.searchSignal.set(username);
  }

  reposQuery = injectInfiniteQuery(() => ({
    queryKey: ['repos', this.searchSignal()],
    queryFn: async ({ pageParam = 1 }) => {
      const url = `https://api.github.com/users/${this.searchSignal()}/repos?page=${pageParam}&per_page=12&sort=updated`;
      return lastValueFrom(this.http.get<any[]>(url));
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 12 ? allPages.length + 1 : undefined;
    },
    enabled: () => !!this.searchSignal(),
    retry: 1,
    refetchOnWindowFocus: false,
  }));

  allRepos = () => this.reposQuery.data()?.pages.flat() ?? [];
}
