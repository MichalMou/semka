import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public userMeno = "";
  public heslo = "";


  constructor(private http : HttpClient) { }

  ngOnInit(): void {
  }

  submit(): void {
    console.log(this.userMeno);
    console.log(this.heslo);
    this.login();
  } 

  login(): void {
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    this.http.post(environment.url + "/user/login", {
    userMeno:this.userMeno, 
    heslo:this.heslo
    },{headers}).subscribe(response=>{
      console.log(response);
    });
  }

}
