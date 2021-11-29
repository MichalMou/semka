import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/services/request.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public userName = "";
  public userNewName = "";
  public pswd = "";
  public newPswd = "";
  public newEmail = "";

  constructor(private http : RequestService, private user : UserDataService, private toastr : ToastrService) { }

  ngOnInit(): void {
  }

// TODO urobit route do profile

  edit(): void {
    this.http.post("/user/login", {
    userName:this.userName, 
    userNewName:this.userNewName,
    newPswd:this.pswd,
    newEmail:this.newEmail
    }).subscribe(response=>{
      if(response.status) {
        // nastavim session id pri uspesnom prihlaseni
        this.user.setSessionId(response.sid);
        
      } else {
        // TODO neuspesne prihlasenie
        this.toastr.error(response.message);
      }
      // test
      console.log(response);
    });
    // TODO podla response vypisat error alebo zapisat niektde udaje 
  }

}
