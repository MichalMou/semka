import { Injectable } from '@angular/core';
import { error } from 'console';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private name = "guest";
  private logedIn = false;
  private rights = 0;
  private email = "";

  constructor(private cookies : CookieService) {}

  setlogedIn(login:boolean): void {
    this.logedIn = login;
  }
  getlogedIn(): boolean {
    return this.logedIn;
  }
  

  setSessionId(id:string): void {
    this.cookies.set("sid",id);
  }
  getSessionId(): string {
    return this.cookies.get("sid");
  }


  setRights(rights:number): void {
    this.rights = rights;
  }
  getRights(): number {
    return this.rights;
  }


  setEmail(email:string): void {
    this.email = this.email;
  }
  getEmail(): string {
    return this.email;
  }


  setName(name:string): void {
    this.name = name;
  }
  getName(): string {
    return this.name;
  }
}
