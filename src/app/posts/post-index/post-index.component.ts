import { Component,  Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import {Post} from '../post.model';
import { PostsService } from '../posts.service';
@Component({
  selector: 'app-post-index',
  templateUrl:'./post-index.component.html',
  styleUrls:['./post-index.component.css']

})
export class PostIndexComponent implements OnInit, OnDestroy {
  constructor(public postService : PostsService){}
  posts: Post[] = [];
  private postsSub: Subscription;


  ngOnInit(){
    this.postService.getPosts();
   this.postsSub = this.postService.getPostUpdateListener().subscribe(
     (posts: Post[]) => {
       this.posts = posts;
     });

 }

 ngOnDestroy(){
   this.postsSub.unsubscribe();
 }

  onComment(postId: string){
    this.postService.commentOnPost(postId, "asdasd", "altaf is a bad person.");
  }
}
