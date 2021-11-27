import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilmyComponent } from './pages/filmy/filmy.component';
import { HomeComponent } from './pages/home/home.component';
import { InfoComponent } from './pages/info/info.component';
import { LoginComponent } from './pages/login/login.component';
import { SerialsComponent } from './pages/serialy/serials.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  //{ path: 'domov', component: HomeComponent },
  { path: 'filmy', component: FilmyComponent },
  //{ path: 'filmy/:nazov', component: FilmyComponent },
  { path: 'serialy', component: SerialsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'info', component: InfoComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
