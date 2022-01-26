import { Component, Input, OnInit } from '@angular/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  public faLeft = faArrowLeft;
  public faRight = faArrowRight;
  public imgNum = 0;
  public img : any;
  public count = 0;
  

  @Input() data? : any[];

  constructor() { }

  ngOnInit(): void {
    this.setImg();
    if (this.data) {
      this.count = this.data.length;
    }
  }

  switchLeft(): void {
    if (this.data) { 
      if(this.imgNum < 1) {
        this.imgNum = this.count - 1;
      } else {
        this.imgNum = (this.imgNum - 1) % this.data.length;
      }
      this.setImg();
    }
  }

  switchRight(): void {
    if (this.data) {
      this.imgNum = (this.imgNum + 1) % this.data.length;
      this.setImg();
    }
  }

  setImg(): void {
    if (this.data) {
      this.img = this.data[this.imgNum];
    }
  }
}
