import { Component,  Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import {Post} from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-post-index',
  templateUrl:'./post-index.component.html',
  styleUrls:['./post-index.component.css']

})
export class PostIndexComponent implements OnInit, OnDestroy {
  constructor(public postService : PostsService){}
  posts: Post[] = [];
  totalPosts = 10;
  pageSizeOptions = [2,4,8];
  postsPerPage = 2;
  currentPage = 1;
  private postsSub: Subscription;
  isLoading = false;


  ngOnInit(){
    this.postService.getPosts(this.postsPerPage,this.currentPage);
   this.postsSub = this.postService.getPostUpdateListener().subscribe(
    (postData:{posts: Post[],postCount:number}) => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts= postData.postCount;


      });

 }

 ngOnDestroy(){
   this.postsSub.unsubscribe();
 }

  onComment(postId: string){
    this.postService.commentOnPost(postId, "asdasd", "altaf is a bad person.");
  }

  onChangedPage(pageData: PageEvent){
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.postsPerPage = pageData.pageSize;
    console.log("current_page:"+this.currentPage);

    console.log("posts per page in on changedPage"+this.postsPerPage);
    this.postService.getPosts(this.postsPerPage,this.currentPage);

  }
}
