import { Component, Input, OnInit } from '@angular/core';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/services/request.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  public name : any;
  public text : any;
  public imgs : any[] = [];
  public uid : any;
  public faDelete = faTrashAlt;
  public faEdit = faEdit;
  public showEdit = false;

  @Input() data ? : any;
  @Input() deleteRev ? : any;
  @Input() reloadRevs ? : any;

  constructor(private http: RequestService,  public user: UserDataService, private toastr : ToastrService) {
    
  }

  ngOnInit(): void {
    this.user.load();
    if(this.data){
      this.uid = this.data.UID;
      this.name = this.data.nazov;
      this.text = this.data.recenzia;
      this.imgs = this.data.img;
    }
  }

  delRev(): void {
    this.deleteRev(this.data.UID);
  }

  editShow(): void {
    this.showEdit = !this.showEdit;
  }
  
  //
  changeImg(event : any): void {
    if (event.target.files.length > 0) {
      for (var i = 0; i < event.target.files.length; i++ ) {
        const reader = new FileReader();
        this.imgs = [];

        reader.addEventListener("load", () => {
          // konvertuje obr do base64 string
          this.imgs.push(reader.result);
        }, false);
  
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  saveChanged(): void {
    this.http.post("/reviews/editReview", {
      UID:this.data.UID,
      nameRev:this.name,
      textRev:this.text,
      imgsRev:this.imgs
      }).subscribe(response=>{
        if (response.status) {
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
        this.reloadRevs();
      });
  }

}
