import { Component, OnInit } from '@angular/core';
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
  public textNews? : any;
  public titleNews? : any;
  

  constructor(private http: RequestService, public user: UserDataService, private toastr : ToastrService) { }

  ngOnInit(): void {
    this.loadImg();
    this.user.load();
  }

  loadImg(): void {
    this.http.get("/homepage/loadNews")
    .subscribe(response=>{
        //console.log(response);
        this.imgNews = response.img;
        this.news = response.news;
        //console.log(this.news);
    });

  }

  saveImg(): void {
    if (this.titleNews === '' || this.textNews === '') {
      this.http.post("/homepage/saveNews", {
      img:this.imgNews,
      title:this.titleNews,
      text:this.textNews
      }).subscribe(response=>{
        this.toastr.error("Úspešne uložené");
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


  // toto pri dani obr do input
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

  

}
