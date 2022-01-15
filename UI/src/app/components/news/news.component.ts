import { Component, Input, OnInit } from '@angular/core';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/services/request.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  public text : any;
  public img : any;
  public titul : any;
  public faDelete = faTrashAlt;
  public faEdit = faEdit;

  @Input() data ? : any;

  constructor(private http: RequestService,  public user: UserDataService, private toastr : ToastrService) { }

  public showMenu = false;

  ngOnInit(): void {
    this.user.load();
  }

  deleteNews(): void {
    this.http.post("/homepage/deleteNews", {
      UID:this.data.UID
      }).subscribe(response=>{
        this.toastr.error("Úspešne uložené");
      });
  }

  editNews(): void {
    this.http.post("/homepage/editNews", {
      UID:this.data.UID
      }).subscribe(response=>{
        this.toastr.error("Úspešne uložené");
      });
  }

  
  showEdit(): void {
    this.showMenu = !this.showMenu;
  }

}
