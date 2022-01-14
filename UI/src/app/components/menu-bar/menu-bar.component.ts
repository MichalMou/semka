import { Component, HostListener, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';
import { faBars, faSignInAlt, faSignOutAlt, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {

  constructor(public user: UserDataService) { }
 
  public faIconBars = faBars;
  public faIconSignIn = faSignInAlt;
  public faIconSignOut = faSignOutAlt;
  public faIconSearch = faSearch;
  public open = false;
  public responsive = false;
  public showMenu = false;
  public winWidth = window.innerWidth;

  ngOnInit(): void {
    this.user.load();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event : any) {
    this.winWidth = event.target.innerWidth;
  }
 
  openList(): void {
    this.open = true;
  }
   
  logout(): void {
    this.user.logout();
  }
 
  show(): void {
    this.showMenu = !this.showMenu;
    console.log(this.showMenu);
  }


   
}
