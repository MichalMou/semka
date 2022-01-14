import { Component, Input, OnInit } from '@angular/core';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
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


  @Input() data ? : any;

  constructor(private http: RequestService,  public user: UserDataService, private toastr : ToastrService) { }

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

}
