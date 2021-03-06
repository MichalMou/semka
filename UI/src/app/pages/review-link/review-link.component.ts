import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/services/request.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-review-link',
  templateUrl: './review-link.component.html',
  styleUrls: ['./review-link.component.scss']
})
export class ReviewLinkComponent implements OnInit {

  public uid : any;
  public name : any;
  public text : any;
  public textP : string[] = [];
  public imgs : any[] = [];
  public imgActor : any;
  public nameActor = "";
  public roleActor = "";
  public faDelete = faTrashAlt;
  public faEdit = faEdit;
  public faPlus = faPlus;
  public showAddActorOption = false;
  public showEdit = false;
  public showImgs = false;
  public newComment = "";
  public comments : any[] = [];
  public actors : any[] = [];

  @Input() data ? : any;
  @Input() deleteRev ? : any;
  @Input() reloadRevs ? : any;

  constructor(private http: RequestService,  public user: UserDataService, private toastr : ToastrService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid');
    this.load();
  }

  load(): void {
     this.http.post("/reviews/load", {
      UID:this.uid
      }).subscribe(response=>{
        this.name = response.revs.nazov;
        this.text = response.revs.recenzia;
        this.textP = this.text.split(/(?:\r\n|\r|\n)/);
        this.imgs = response.imgs;
        this.showImgs = true;
      });  
      this.loadComment();
      this.loadActor();
  }

  delRev(): void {
    // console.log(this.deleteRev);
    // this.deleteRev(this.uid);
    // console.log("delete");
    var c = window.confirm("Naozaj chcete vymazať?");
    if (c) {
      this.http.post("/reviews/deleteReview", {
        UID:this.uid
      }).subscribe(response=>{
        this.router.navigate(["filmy"]);
      });
    }
    
  }

  editShow(): void {
    this.showEdit = !this.showEdit;
  }
  
  changeImg(event : any): void {
    if (event.target.files.length > 0) {
      for (var i = 0; i < event.target.files.length; i++ ) {
        const reader = new FileReader();
        this.imgs = [];

        reader.addEventListener("load", () => {
          // konvertuje obr do base64 string
          this.imgs.push(reader.result);
        }, false);
  
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  saveChanged(): void {
    this.textP = this.text.split(/(?:\r\n|\r|\n)/);
    this.http.post("/reviews/editReview", {
      UID:this.uid,
      nameRev:this.name,
      textRev:this.text,
      imgsRev:this.imgs
      }).subscribe(response=>{
        if (response.status) {
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
      });
  }

  
  saveComment(): void {
    this.http.post("/comments/saveComment", {
      rev:this.uid,
      user:this.user.name,
      text:this.newComment
      }).subscribe(response=>{
        if (response.status) {
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
        this.newComment = "";
        this.loadComment();
      });
  }

  loadComment(): void {
    this.http.post("/comments/loadComment", {
      rev:this.uid
      }).subscribe(response=>{
        this.comments = response.comments.reverse();
      });
  }

  deleteComm = (uid: any): void => {
    this.http.post("/comments/deleteComment", {
      UID:uid
    }).subscribe(response=>{
      this.toastr.success("Úspešne vymazaný");
      this.load();
    });
  }

  reloadComm = (): void => {
    this.load();
  }

  
  showAddActor(): void {
    this.showAddActorOption = !this.showAddActorOption;
  }

  changeActorImg(event : any): void {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      // konvertuje obr do base64 string
      this.imgActor = reader.result;
    }, false);

    if (event.target.files.length > 0) {
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  saveActor(): void {
    if (this.roleActor != "" && this.nameActor != ""){}
    this.http.post("/actor/saveActor", {
      UID:this.uid,
      nameActor:this.nameActor,
      roleActor:this.roleActor,
      imgActor:this.imgActor
      }).subscribe(response=>{
        this.toastr.error(response.message);
        this.nameActor = "";
        this.roleActor = "";
        this.imgActor = "";
        this.load();
      });
  }

  loadActor(): void {
    this.http.post("/actor/loadActor", {
      UID:this.uid
      }).subscribe(response=>{
        this.actors = response.actors;
      });
  }
}
