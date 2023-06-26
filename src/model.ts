export interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  html_url: string;
}

export type UserId = number;

export interface User {
  login: string;
  id: UserId;
  avatar_url: string;
  repos_url: string;
  repos_data?: Array<Repo>;
  repos_open: boolean;
}

export type Users = Array<User>;
