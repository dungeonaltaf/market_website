import { Component,  Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import {Post} from '../post.model';
import { PostsService } from '../posts.service';
@Component({
  selector: 'app-post-list',
  templateUrl:'./post-list.component.html',
  styleUrls:['./post-list.component.css']

})
export class PostListComponent implements  OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  constructor(public postService : PostsService){
  }
  ngOnInit(){
    this.isLoading = true;
     this.postService.getPosts();
    console.log("ngon in it pushed");
    this.postsSub = this.postService.getPostUpdateListener().subscribe(
      (posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });

  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

  onDelete(postId: string){
    console.log("deletion for several ids"+postId);
    this.postService.deletePost(postId);
  }
}
