import { Component, Input, OnInit } from '@angular/core';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/services/request.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-actor',
  templateUrl: './actor.component.html',
  styleUrls: ['./actor.component.scss']
})
export class ActorComponent implements OnInit {

  public faDelete = faTrashAlt;
  public faEdit = faEdit;
  public showEditActor = false;
  public name = "";
  public role = "";
  public img : any;

  @Input() data ? : any;
  @Input() reloadMethod ? : any;

  constructor(private http: RequestService,  public user: UserDataService, private toastr : ToastrService) { }

  ngOnInit(): void {
    console.log(this.data);
    this.name = this.data.meno;
    this.role = this.data.rola;
    this.img = this.data.img;
  }

  changeActorImg(event : any): void {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      // konvertuje obr do base64 string
      this.img = reader.result;
    }, false);

    if (event.target.files.length > 0) {
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  
  showEditAct(): void {
    this.showEditActor = !this.showEditActor;
  }

  editAct(): void {
    this.http.post("/actor/editActor", {
      UID:this.data.UID,
      name:this.name, 
      role:this.role,
      img:this.img
    }).subscribe(response=>{
      console.log(response);
      this.reloadMethod();
    });
  }

  deleteAct(): void {
    this.http.post("/actor/deleteActor", {
      UID:this.data.UID
    }).subscribe(response=>{
      this.toastr.success("Úspešne vymazaný");
      this.reloadMethod();
    });
  }
}
