import { Injectable } from '@angular/core';
//import { error } from 'console'; 
import { CookieService } from 'ngx-cookie-service';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  public name = "guest";
  public logedIn = false;
  public rights = 0;
  public email = "";

  constructor(private cookies : CookieService, private req : RequestService) {}

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
    this.email = email;
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

  load(): void {
    this.req.get("/user/load")
    .subscribe(response=>{
        if (response.status === true) {
          this.email = response.email;
          this.rights = response.rights;
          this.name = response.userName;
          this.logedIn = true;
        }
      }
    );
  }

  logout() {
    this.setName("guest");
    this.setEmail("");
    this.setlogedIn(false);
    this.rights = 0;

    this.req.get("/user/logout")
    .subscribe(response=>{
      }
    );

  }
}
