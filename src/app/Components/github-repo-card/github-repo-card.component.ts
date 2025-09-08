import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-github-repo-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './github-repo-card.component.html',
})
export class GithubRepoCardComponent {
  repo = input<any>();

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

  getLanguageColor(language: string): string {
    const colors: { [key: string]: string } = {
      'JavaScript': 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30',
      'TypeScript': 'bg-blue-400/20 text-blue-300 border border-blue-400/30',
      'Python': 'bg-green-400/20 text-green-300 border border-green-400/30',
      'Java': 'bg-red-400/20 text-red-300 border border-red-400/30',
      'Go': 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30',
      'Rust': 'bg-orange-400/20 text-orange-300 border border-orange-400/30',
      'C++': 'bg-purple-400/20 text-purple-300 border border-purple-400/30',
      'C#': 'bg-indigo-400/20 text-indigo-300 border border-indigo-400/30',
      'PHP': 'bg-violet-400/20 text-violet-300 border border-violet-400/30',
      'Ruby': 'bg-pink-400/20 text-pink-300 border border-pink-400/30',
    };
    return colors[language] || 'bg-gray-400/20 text-gray-300 border border-gray-400/30';
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
}
