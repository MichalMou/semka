import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/services/request.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public userName = "";
  public pswd = "";

  constructor(private http : RequestService, public user : UserDataService, private toastr : ToastrService) { }

  ngOnInit(): void {
  }

  login(): void {
    this.http.post("/user/login", {
    userName:this.userName, 
    pswd:this.pswd
    }).subscribe(response=>{
      if(response.status) {
        // nastavim session id pri uspesnom prihlaseni
        this.user.setSessionId(response.sid);
        this.toastr.success(response.message);
        this.user.setlogedIn(response.status);
        this.user.setName(this.userName);
        this.user.setEmail(response.email);
      } else {
        // neuspesne prihlasenie
        this.toastr.error(response.message);
      }
    });
  }

}
