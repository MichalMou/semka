import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  public uid : any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid');
    console.log(this.uid);
  }

}
