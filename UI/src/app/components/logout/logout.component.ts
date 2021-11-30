import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor( public user : UserDataService) { }

  ngOnInit(): void {
  }
  
  logout(): void {
    this.user.setName("guest");
    this.user.setEmail("");
    this.user.setlogedIn(false);
  }

}
