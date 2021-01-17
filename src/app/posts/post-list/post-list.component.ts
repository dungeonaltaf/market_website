import { Component,  Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import {Post} from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-post-list',
  templateUrl:'./post-list.component.html',
  styleUrls:['./post-list.component.css']

})
export class PostListComponent implements  OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [2,4,8];
  constructor(public postService : PostsService){
  }
  ngOnInit(){
    this.isLoading = true;
     this.postService.getUserPosts(this.postsPerPage,this.currentPage);
    this.postsSub = this.postService.getPostUpdateListener().subscribe(
      (postData:{posts: Post[],postCount:number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        // console.log("POST+++++"+this.posts);
        this.totalPosts= postData.postCount;
        // console.log("total posts"+this.totalPosts);
      });

  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

  onDelete(postId: string){
    this.postService.deletePost(postId).subscribe(()=>{
      this.isLoading = true;
      this.postService.getUserPosts(this.postsPerPage,this.currentPage);
    });
  }


  onChangedPage(pageData: PageEvent){
    // console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.postsPerPage = pageData.pageSize;
    // console.log("current_page:"+this.currentPage);

    // console.log("posts per page"+this.postsPerPage);
    this.postService.getUserPosts(this.postsPerPage,this.currentPage);
  }
}
