export interface Owner {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks: number;
  open_issues: number;
  language: string | null;
  owner: Owner;
}

export interface SearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repo[];
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  html_url: string;
  user: Owner;
}
