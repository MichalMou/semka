import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private user: UserDataService) { }

  ngOnInit(): void {
  }

  increaseId(): void {
    this.user.set(this.user.id + 1);
  }
}
