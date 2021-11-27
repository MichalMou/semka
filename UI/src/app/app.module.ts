import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { SearchComponent } from './components/search/search.component';
import { MenuComponent } from './components/menu/menu.component';
import { TitleComponent } from './components/title/title.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ContentBarComponent } from './components/content-bar/content-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { FilmyComponent } from './pages/filmy/filmy.component';
import { SerialsComponent } from './pages/serialy/serials.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { InfoComponent } from './pages/info/info.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    SearchComponent,
    MenuComponent,
    TitleComponent,
    ContentBarComponent,
    FooterComponent,
    HomeComponent,
    FilmyComponent,
    SerialsComponent,
    LoginComponent,
    SignUpComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
