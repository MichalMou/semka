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

  public userNewName = "";
  public newPswd = "";
  public newEmail = "";
  public userName = this.user.getName();
  public email = this.user.getEmail();

  constructor(private http : RequestService, public user : UserDataService, private toastr : ToastrService) { }

  ngOnInit(): void {
  }

  edit(): void {
    if (this.userName == "" || this.email == "" || this.newPswd == "") {
      this.toastr.error("Prosím vyplnte údaje.");
    } else {
      if (this.validateEmail()){
        
        this.http.post("/user/edit", {
          userName:this.user.getName(), 
          userNewName:this.userNewName,
          newPswd:this.newPswd,
          email:this.user.getEmail(),
          newEmail:this.newEmail
        }).subscribe(response=>{

          if(response.status) {
            // uspesna zmena udajov
            this.toastr.error(response.message);  
            // TODO zmenit udaje user
            this.user.setName(this.userNewName);
            this.user.setEmail(this.newEmail);
            this.userName = this.userNewName;
            this.email = this.newEmail;
          } else {
            // neuspesna zmena udajov
            this.toastr.error(response.message);
          }
        });
      }
      
    }

  }

  delete(): void{
    this.http.post("/user/delete", {
      userName:this.user.getName(), 
      email:this.user.getEmail()
      }).subscribe(response=>{
        if(response.status) {
          // uspesne zmazany acc
          this.toastr.error(response.message);  
          // zmenit udaje user
          this.user.setName("guest");
          this.user.setEmail("");
          this.user.setlogedIn(false);

        } else {
          // neuspesna zmena udajov
          this.toastr.error(response.message);
        }
      });

  }

  validateEmail(): boolean {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.newEmail))
      {
        return (true)
      }
        this.toastr.error("Prosím zadajte platny email.", "Zadaný email nemá platnu formu, nemôže obsahovat ! # $ % & ' * + - / = ? ^ _ ` { | } ~");
        return (false)
    }

}
