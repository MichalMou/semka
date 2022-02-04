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

  public text : string[] = [];
  public img : any;
  public titul : any;
  public faDelete = faTrashAlt;
  public faEdit = faEdit;
  public showEdit = false;
  

  @Input() data ? : any;
  @Input() delMethod ? : any;
  @Input() reloadNews ? : any;

  constructor(private http: RequestService,  public user: UserDataService, private toastr : ToastrService) { }

  ngOnInit(): void {
    this.user.load();
    this.text = this.data.text.split(/(?:\r\n|\r|\n)/);
    this.titul = this.data.titul;
    this.img = this.data.img;
  }

  deleteNews(): void {
    this.delMethod(this.data.UID);
  }

  editShow(): void {
    this.showEdit = !this.showEdit;
  }
  
  changeImg(event : any): void {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      // konvertuje obr do base64 string
      this.img = reader.result;
    }, false);

    if (event.target.files.length > 0) {
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  saveChanged(): void {
    this.http.post("/homepage/editNews", {
      UID:this.data.UID,
      titul:this.titul,
      text:this.text,
      img:this.img
      }).subscribe(response=>{
        this.toastr.error(response.message);
      });
      this.reloadNews();
  }
}
