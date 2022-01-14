import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';
import { faHamburger, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {

  constructor(public user: UserDataService) { }
 
  public faIconBurger = faHamburger;
  public faIconSignIn = faSignInAlt;
  public faIconSignOut = faSignOutAlt;
  public open = false;
  public responsive = false;

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
