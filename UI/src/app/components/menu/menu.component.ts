import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(public user: UserDataService) { }

  ngOnInit(): void {
    // zavolat user/load
    //this.user.
  }

  logout(): void {
    this.user.setName("guest");
    this.user.setEmail("");
    this.user.setlogedIn(false);
  }

}
