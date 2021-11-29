import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient, private cookie: CookieService) { }


  //  funkcia na get
  get(url: string): Observable<any> {
    return this.http.get<any>(environment.url + url, {
      headers: new HttpHeaders({ "SID": this.cookie.get("sid") })
    });
  }

  // funkcia na post 
  post(url: string, data: any): Observable<any> {
    return this.http.post<any>(environment.url + url, data, {
      headers: new HttpHeaders({ "SID": this.cookie.get("sid") })
    });
  }
}
