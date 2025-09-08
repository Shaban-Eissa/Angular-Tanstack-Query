import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { RepoDetailsComponent } from './Components/repo-details/repo-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'repo/:owner/:name', component: RepoDetailsComponent },
  { path: '**', redirectTo: '' },
];
