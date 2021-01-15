import { Post } from "./post.model";
import { Comment } from "./comment.model";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

@Injectable({
  providedIn:'root'
})
export class PostsService{
  constructor(private http: HttpClient, private router: Router){}
  private posts: Post[] = [];
  private postUpdate = new Subject<Post[]>();
  fetch_address = "http://localhost:3000/api/posts/";
  create_address = "http://localhost:3000/api/post/";
  getPosts(){
    this.http.get<{message:string, posts: any}>(this.fetch_address).pipe(map((postData)=>{
      return postData.posts.map(post=>{
        return {
          title : post.title,
          content : post.content,
          id: post._id
        }
      });
    }))
    .subscribe((transformed_postData)=>{
      this.posts = transformed_postData;
      this.postUpdate.next([...this.posts]);
    });
  }

  getPostUpdateListener(){
    return this.postUpdate.asObservable();
  }

  getPost(id: string){
    return this.http.get<{_id: string,title: string,content: string, price: number, comments: Array<{comment:string,commentator:string}>}>(this.create_address+id);
  }
  addPosts(title: string, content: string, price: number , images: File){
    const postData = new FormData();
    console.log("price is"+price);
    postData.append("title",title);
    postData.append("content",content);
    postData.append("price",price.toString());

    for (let i =0; i < File.length; i++){
      console.log("count:"+i);
      console.log("images"+images[i]);
      postData.append("images[]",images[i]);
    }

    console.log("postData guys!"+postData.getAll('images[]'));
    console.log("postData guys!"+postData.get('images[]'));
    this.http.post<{messsage: string, postId: string}>(this.create_address,postData).subscribe(responseData => {
      const post: Post={
        id:responseData.postId,
        title:title,
        content:content,
        price: price,
        comments:null
      }
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);

      this.postUpdate.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  updatePost(id: string, title: string, price: number, content: string){
    const post: Post = {id: id,title:title,content:content, price: price, comments:null};
    this.http.put<{messsage: string, postId: string}>(this.create_address+id,post).subscribe(responseData=>{
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p=>p.id===post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postUpdate.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string){
    this.http.delete(this.create_address+postId)
    .subscribe(()=> {
    const updatedPosts = this.posts.filter(post=>post.id!=postId);
    this.posts = updatedPosts;
    this.postUpdate.next([...this.posts]);
    });
  }




  commentOnPost(postId: string, user_id: string, comment_content: string){
    const comment = {user_id:user_id,comment:comment_content};
    this.http.post<{messsage: string, postId: string}>(this.create_address+postId+'/comment/',comment).subscribe(responseData => {
      const updatedPosts = this.posts.filter(post=>post.id==postId);
      this.postUpdate.next([...this.posts]);
    });
  }

}