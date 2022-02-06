import { Component, Input, OnInit } from '@angular/core';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/services/request.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public news : any[] = [];
  public imgNews? : any;
  public textNews = "";
  public titleNews = "";
  public showMenu = false;
  public showAdd = false;
  public faMinus = faMinus;
  public faPlus = faPlus;

  constructor(private http: RequestService, public user: UserDataService, private toastr : ToastrService) { }

  ngOnInit(): void {
    this.loadImg();
    this.user.load();
  }

  loadImg(): void {
    this.http.get("/homepage/loadNews")
    .subscribe(response=>{
        // this.imgNews = response.img;
        this.news = response.news;
    });
  }

  saveImg(): void {
    if (this.titleNews != '' && this.textNews != '') {
      this.http.post("/homepage/saveNews", {
      img:this.imgNews,
      title:this.titleNews,
      text:this.textNews
      }).subscribe(response=>{
        this.toastr.success("Úspešne uložené");
        this.loadImg();
      });
    } else {
      this.toastr.error("Titulka a Článok nemôžu byť prázdne.")
    }
  }

  changeTitle(title : any): void {
    this.titleNews = title.value;
  }

  changeText(text : any): void {
    this.textNews = text.value;
  }

  changeImg(event : any): void {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      // konvertuje obr do base64 string
      this.imgNews = reader.result;
    }, false);

    if (event.target.files.length > 0) {
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  // lambda zapis funkcie normalny robil neplechu
  deleteNews = (uid: any): void => {
    this.http.post("/homepage/deleteNews", {
      UID:uid
    }).subscribe(response=>{
      this.toastr.success("Úspešne vymazané");
      this.loadImg();
    });
  }

  reloadNews = (uid: any): void => {
    this.loadImg();
  }

  cShowAdd(): void {
    this.showAdd = !this.showAdd;
  }
}
