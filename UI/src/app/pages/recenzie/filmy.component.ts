import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/services/request.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-filmy',
  templateUrl: './filmy.component.html',
  styleUrls: ['./filmy.component.scss']
})
export class FilmyComponent implements OnInit {

  // udrziava svetky reviews a ich casti
  public revs : any[] = []; 

  public showMenu = false;
  
  // na ukladacie procesy
  public imgsRev : any[] = [];
  public textRev = "";  
  public nameRev = "";
  public showAdd = false;
  public faMinus = faMinus;
  public faPlus = faPlus;
  


  constructor(private http: RequestService, public user: UserDataService, private toastr : ToastrService) { }

  ngOnInit(): void {
    this.loadRevs();
    this.user.load();
  }

  changeImg(event : any): void {
    if (event.target.files.length > 0) {
      for (var i = 0; i < event.target.files.length; i++ ) {
        const reader = new FileReader();
        this.imgsRev = [];

        reader.addEventListener("load", () => {
          // konvertuje obr do base64 string
          this.imgsRev.push(reader.result);
          // console.log(i);
        }, false);
  
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  saveRev(): void {
    if (this.nameRev != "" && this.textRev != "") {
      this.http.post("/reviews/saveReview", {
      nameRev:this.nameRev,
      textRev:this.textRev,
      imgsRev:this.imgsRev
      }).subscribe(response=>{
        this.toastr.error(response.message);
        this.loadRevs();
      });
    }
  }

  loadRevs(): void {
    this.http.get("/reviews/loadReview")
    .subscribe(response=>{
        // this.imgNews = response.img;
        this.revs = response.revs;
    });
  }

  cShowAdd(): void {
    this.showAdd = !this.showAdd;
  }


  // TODO prerobit lambda zapisane del a reload + prirobit edit do review
  deleteRev = (uid: any): void => {
    this.http.post("/reviews/deleteReview", {
      UID:uid
    }).subscribe(response=>{
      this.toastr.error("Úspešne vymazané");
      this.loadRevs();
    });
  }

  reloadRevs = (uid: any): void => {
    this.loadRevs();
  }


  loadRev(): void {
    
  }
}
// this.http.post("/reviews/saveReview/home/"+"1", 1 je uid prerobit na premennu 
// detail recenzie
