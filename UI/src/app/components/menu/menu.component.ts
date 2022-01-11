import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';
import { faBars, faHamburger, faSignal, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public faIconBurger = faHamburger;
  public faIconSignIn = faSignInAlt;
  public faIconSignOut =faSignOutAlt;
  public open = false;
  public responsive = false;

  constructor(public user: UserDataService) { }

  ngOnInit(): void {
   this.user.load();
  }

  openList(): void {
    this.open = true;
  }
  
  logout(): void {
    this.user.logout();
  }


}
