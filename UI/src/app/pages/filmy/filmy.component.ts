import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-filmy',
  templateUrl: './filmy.component.html',
  styleUrls: ['./filmy.component.scss']
})
export class FilmyComponent implements OnInit {

  nazov:string | null = "neviem uz";

  constructor(private route : ActivatedRoute, public user : UserDataService, private http : HttpClient) { }

  ngOnInit(): void {
    console.log(this.user.meno);
    this.nazov = this.route.snapshot.paramMap.get('nazov');
  }

  load(): void {
    this.http.get("http://localhost/semka/api/www/home/dom/" + this.nazov).subscribe(
      result=>{
        console.log(result);
      },
      error=>{}      
    );

    this.http.post("http://localhost/semka/api/www/home/dom/", {
      meno:this.user.meno, 
      id:this.user.id
    });

  }
}
