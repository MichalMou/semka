import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  meno = "guest";
  id = 0;

  constructor() { }

  set(id:number) {
    this.id = id;
  }

}
