import { Post } from "./post.model";
import { Comment } from "./comment.model";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { Form } from '@angular/forms';
import {environment} from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/posts"
@Injectable({
  providedIn:'root'
})
export class PostsService{
  constructor(private http: HttpClient, private router: Router){}
  private posts: Post[] = [];
  private postUpdate = new Subject<{posts:Post[], postCount:number}>();
  getPosts(postsPerPage:number,currentPage:number){
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`
    // console.log("pagePerSize"+postsPerPage);
    // console.log("page"+currentPage);
    this.http.get<{message:string, posts: any, maxPosts: number}>(BACKEND_URL+"/"+queryParams).pipe(map((postData)=>{


      // console.log("postData"+postData.message);
      // console.log("posts are"+postData.posts[0].author.firstName);
      return{
      posts: postData.posts.map(post=>{
        return {
          title : post.title,
          content : post.content,
          id: post._id,
          price: post.price,
          imagePath: post.imagePath,
          author_phone: post.author.phone,
          author_name: post.author.firstName,
          comments: post.comments
        };
      }),
        maxPosts: postData.maxPosts
    };

    }))
    .subscribe((transformed_postData)=>{
      this.posts = transformed_postData.posts;
      this.postUpdate.next({posts:[...this.posts],postCount:transformed_postData.maxPosts});
    });
  }




  getUserPosts(postsPerPage:number,currentPage:number){
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`
    // console.log("pagePerSize"+postsPerPage);
    // console.log("page"+currentPage);
    this.http.get<{message:string, posts: any, maxPosts: number}>(BACKEND_URL+"/user"+queryParams).pipe(map((postData)=>{


      // console.log("postData"+postData.message);
      // console.log("posts are"+postData.posts[0].author.firstName);
      return{
      posts: postData.posts.map(post=>{
        return {
          title : post.title,
          content : post.content,
          id: post._id,
          price: post.price,
          imagePath: post.imagePath,
          author_phone: post.author.phone,
          author_name: post.author.firstName,
          comments: post.comments
        };
      }),
        maxPosts: postData.maxPosts
    };

    }))
    .subscribe((transformed_postData)=>{
      this.posts = transformed_postData.posts;
      this.postUpdate.next({posts:[...this.posts],postCount:transformed_postData.maxPosts});
    });
  }

  getPostUpdateListener(){
    return this.postUpdate.asObservable();
  }

  getPost(id: string){
    return this.http.get<{_id: string,
      title: string,
      content: string,
      price: number,
      imagePath: string,
      author: any,
      comments: Array<{comment:string,commentator:string}>}>(BACKEND_URL+"/"+id);
  }
  addPosts(title: string, content: string, price: number , images: File){
    const postData = new FormData();
    postData.append("title",title);
    postData.append("content",content);
    postData.append("price",price.toString());
    postData.append("images",images);

    // for (let i =0; i < File.length; i++){
    //   console.log("count:"+i);
    //   console.log("images"+images[i]);
    //   postData.append("images[]",images[i]);
    // }
    this.http.post<{messsage: string, post: Post}>(BACKEND_URL+"/",postData).subscribe(responseData => {
      this.router.navigate(["/"]);
    });
  }

  updatePost(id: string, title: string, content: string, price: number, images: File | string){
    var postData: FormData | Post;
    if (typeof(images)==='object'){
      // console.log("image updation has taken place!!");
      postData = new FormData();
      postData.append("title",title);
      postData.append("price",price.toString());
      postData.append("content",content);
      postData.append("images",images,title);
    }
    else{
      postData =  {id: id,title:title,content:content, price: price, imagePath: images,author_name:null, author_phone:null, comments:null};
    }


    // console.log("post data:"+postData);
    this.http.put<{messsage: string, postId: string, imagePath: string}>(BACKEND_URL+"/"+id,postData).subscribe(responseData=>{
      this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string){
    return this.http.delete(BACKEND_URL+"/"+postId)

  }




  commentOnPost(postId: string, comment_content: string){
    var comment = {id:postId,comment:comment_content};
    this.http.post<{messsage: string, postId: string}>(BACKEND_URL+"/comment",comment).subscribe(responseData => {
      console.log("comment has been done!");
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      this.router.navigate(["/"]);
      // this.postUpdate.next([...this.posts]);
    });
  }

}
