import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  @Input() data ? : any;
  @Input() deleteRev ? : any;
  @Input() reloadRevs ? : any;

  constructor() { }

  ngOnInit(): void {
  }

}
