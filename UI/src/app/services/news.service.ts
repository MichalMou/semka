import { Injectable } from '@angular/core';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  //atribut skladujuci news (text,obr,nazov) 

  constructor(private http: RequestService) { }

  loadNews(): void {
    // posle sa poziadavka o news na server a spracuje sa
    
  }

}
