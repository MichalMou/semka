import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public news : any[] = [];
  public imgNews? : any;

  constructor(private http: RequestService) { }

  ngOnInit(): void {
  }

  loadImg(): void {
    this.http.get("/homepage/loadImg")
    .subscribe(response=>{
        console.log(response);
        this.imgNews = response.img;
        this.news = [];
        this.news = response.news;
        console.log(this.news);

    });

  }

  saveImg(): void {
    console.log(this.imgNews);
    this.http.post("/homepage/saveImg", {
      img:this.imgNews
      }).subscribe(response=>{
        console.log(response);
      });

      // TODO pri ukladani 
  }

  // toto pri load do input
  onChange(event : any): void {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      // convert image file to base64 string
      this.imgNews = reader.result;
    }, false);

    if (event.target.files.length > 0) {
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
