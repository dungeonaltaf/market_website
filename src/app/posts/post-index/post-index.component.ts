import { Component,  Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import {Post} from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import {  FormGroup, FormControl, Validators, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-post-index',
  templateUrl:'./post-index.component.html',
  styleUrls:['./post-index.component.css']

})
export class PostIndexComponent implements OnInit, OnDestroy {
  constructor(public postService : PostsService, private authService: AuthService, public route: ActivatedRoute){}
  posts: Post[] = [];
  totalPosts = 10;
  pageSizeOptions = [2,4,8];
  postsPerPage = 2;
  currentPage = 1;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  isLoading = false;
  form:FormGroup;
  userIsAuthenticated = false;


  ngOnInit(){
    this.form = new FormGroup({
      comment: new FormControl(null,{
        validators:[Validators.required, Validators.minLength(3)]})
    });


    this.route.paramMap.subscribe((paramMap: ParamMap) =>{
      this.postService.getPosts(this.postsPerPage,this.currentPage);
    });
    this.postService.getPosts(this.postsPerPage,this.currentPage);
    this.userIsAuthenticated = this.authService.getAuthStatus()
    this.authStatusSub =  this.authService.getAuthStatusListener().subscribe(isAuthenticated =>{
      this.userIsAuthenticated = isAuthenticated;
      // console.log("++++++++++++++++authentication status++++++++++++++++++++++++++++++++++++++++++++++:"+this.userIsAuthenticated);
     });
   this.postsSub = this.postService.getPostUpdateListener().subscribe(
    (postData:{posts: Post[],postCount:number}) => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts= postData.postCount;
      });
  }

 ngOnDestroy(){
   this.postsSub.unsubscribe();
   this.authStatusSub.unsubscribe();
 }

  onComment(postId){
    if (this.form.invalid){
      return;
    }
    this.isLoading=true;
    let comment = this.form.value.comment;
    this.postService.commentOnPost(postId, comment);
    this.form.reset();
  }

  onChangedPage(pageData: PageEvent){
    // console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.postsPerPage = pageData.pageSize;
    // console.log("current_page:"+this.currentPage);

    // console.log("posts per page in on changedPage"+this.postsPerPage);
    this.postService.getPosts(this.postsPerPage,this.currentPage);

  }
}
