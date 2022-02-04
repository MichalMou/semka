import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { SearchComponent } from './components/search/search.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ContentBarComponent } from './components/content-bar/content-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { FilmyComponent } from './pages/recenzie/filmy.component';
// import { SerialsComponent } from './pages/serialy/serials.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { InfoComponent } from './pages/info/info.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LogoutComponent } from './components/logout/logout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NewsComponent } from './components/news/news.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ReviewComponent } from './components/review/review.component';
import { ReviewLinkComponent } from './pages/review-link/review-link.component';
import { ActorComponent } from './components/actor/actor.component';
import { CommentComponent } from './components/comment/comment.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    SearchComponent,
    ContentBarComponent,
    FooterComponent,
    HomeComponent,
    FilmyComponent,
    // SerialsComponent,
    LoginComponent,
    SignUpComponent,
    InfoComponent,
    LogoutComponent,
    ProfileComponent,
    NewsComponent,
    GalleryComponent,
    ReviewComponent,
    ReviewLinkComponent,
    ActorComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
