import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/services/request.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  public userName = "";
  public pswd = "";
  public rePswd = "";
  public email = "";

  constructor(private http : RequestService, private toastr : ToastrService) { }

  ngOnInit(): void {
  }

  // TODO post zmenit na register

  register(): void {
    //kontrola pswd
    if (this.userName == "" || this.email == "" || this.pswd == "") {
      this.toastr.error("Prosím vyplnte údaje.");
    } else {
      if(this.pswd != this.rePswd) {
        this.toastr.error("Hesla sa nezhoduju!");
      } else {
        if (this.validateEmail())
        {
          this.http.post("/user/register", {
            userName:this.userName, 
            pswd:this.pswd,
            email:this.email
            }).subscribe(response=>{
              this.toastr.error(response.message);
            });
        }
      }
    }
  }
  
  // podmienka na validovane emailu
  validateEmail(): boolean {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email))
    {
      return (true)
    }
      this.toastr.error("Prosím zadajte platny email.", "Zadaný email nemá platnu formu, nemôže obsahovat ! # $ % & ' * + - / = ? ^ _ ` { | } ~");
      return (false)
  }

}
