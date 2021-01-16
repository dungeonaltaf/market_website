import { Post } from "./post.model";
import { Comment } from "./comment.model";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { Form } from '@angular/forms';

@Injectable({
  providedIn:'root'
})
export class PostsService{
  constructor(private http: HttpClient, private router: Router){}
  private posts: Post[] = [];
  private postUpdate = new Subject<{posts:Post[], postCount:number}>();
  fetch_address = "http://localhost:3000/api/posts/";
  create_address = "http://localhost:3000/api/post/";
  getPosts(postsPerPage:number,currentPage:number){
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`
    console.log("pagePerSize"+postsPerPage);
    console.log("page"+currentPage);
    this.http.get<{message:string, posts: any, maxPosts: number}>(this.fetch_address+queryParams).pipe(map((postData)=>{


      console.log("postData"+postData.message)
      return{
      posts: postData.posts.map(post=>{
        return {
          title : post.title,
          content : post.content,
          id: post._id,
          price: post.price,
          imagePath: post.imagePath,
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
    return this.http.get<{_id: string,title: string,content: string, price: number, imagePath: string, comments: Array<{comment:string,commentator:string}>}>(this.create_address+id);
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
    this.http.post<{messsage: string, post: Post}>(this.create_address,postData).subscribe(responseData => {
      this.router.navigate(["/"]);
    });
  }

  updatePost(id: string, title: string, content: string, price: number, images: File | string){
    var postData: FormData | Post;
    if (typeof(images)==='object'){
      console.log("image updation has taken place!!");
      postData = new FormData();
      postData.append("title",title);
      postData.append("price",price.toString());
      postData.append("content",content);
      postData.append("images",images,title);
    }
    else{
      postData =  {id: id,title:title,content:content, price: price, imagePath: images  , comments:null};
    }


    console.log("post data:"+postData);
    this.http.put<{messsage: string, postId: string, imagePath: string}>(this.create_address+id,postData).subscribe(responseData=>{
      this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string){
    return this.http.delete(this.create_address+postId)

  }




  commentOnPost(postId: string, user_id: string, comment_content: string){
    const comment = {user_id:user_id,comment:comment_content};
    this.http.post<{messsage: string, postId: string}>(this.create_address+postId+'/comment/',comment).subscribe(responseData => {
      const updatedPosts = this.posts.filter(post=>post.id==postId);
      // this.postUpdate.next([...this.posts]);
    });
  }

}
