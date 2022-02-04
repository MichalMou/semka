import { Component, Input, OnInit } from '@angular/core';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { RequestService } from 'src/app/services/request.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  public text : any;
  public faDelete = faTrashAlt;
  public faEdit = faEdit;
  public showEdit = false;

  @Input() data ? : any;
  @Input() delMethod ? : any;
  @Input() reloadMethod ? : any;

  constructor(private http: RequestService,  public user: UserDataService) { }

  ngOnInit(): void {
    this.user.load();
    if(this.data){
      this.text = this.data.text;
    }
  }

  showEditComment(): void {
    this.showEdit = !this.showEdit;
    this.text = this.data.text;
  }

  saveEditedComment(): void {
    this.http.post("/comments/deleteComment", {
      UID:this.data.UID,
      text:this.text
    }).subscribe(response=>{
      this.reloadMethod();
    });
  }

  deleteComment(): void {
    this.delMethod(this.data.UID);
  }

}
