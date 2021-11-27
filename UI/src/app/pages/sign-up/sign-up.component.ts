import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  public userMeno = "";
  public heslo = "";
  public reHeslo = "";
  public email = "";

  constructor(private http : HttpClient) { }

  ngOnInit(): void {
  }

  // TODO post zmenit na register

  register(): void {
    if(this.reHeslo == this.heslo) {
      const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
      this.http.post(environment.url + "/user/login", {
      userMeno:this.userMeno, 
      heslo:this.heslo
      },{headers}).subscribe(response=>{
        console.log(response);
      });
    } else {
      //TODO vypis meno a heslo sa neyhoduju
    }
   
  }

}
