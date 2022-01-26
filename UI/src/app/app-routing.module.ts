import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilmyComponent } from './pages/recenzie/filmy.component';
import { HomeComponent } from './pages/home/home.component';
import { InfoComponent } from './pages/info/info.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SerialsComponent } from './pages/serialy/serials.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ReviewComponent } from './pages/review/review.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'filmy', component: FilmyComponent },
  { path: 'serialy', component: SerialsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'info', component: InfoComponent },
  { path: 'profil', component: ProfileComponent },
  { path: 'review/:uid', component: ReviewComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
