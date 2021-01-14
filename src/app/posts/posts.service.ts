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
    console.log("get for pos request")
    return this.http.get<{_id: string,title: string,content: string, price: number, comments: Array<{comment:string,commentator:string}>}>(this.create_address+id);
  }
  addPosts(title: string, content: string, price: number){
    const post: Post = {id: null,title:title,content:content, price:price, comments:null};
    this.http.post<{messsage: string, postId: string}>(this.create_address,post).subscribe(responseData => {
      console.log("message"+responseData.messsage);
      console.log("postId:"+responseData.postId);
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      console.log("pushed");
      this.postUpdate.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  updatePost(id: string, title: string, price: number, content: string){
    const post: Post = {id: id,title:title,content:content, price: price, comments:null};
    this.http.put<{messsage: string, postId: string}>(this.create_address+id,post).subscribe(responseData=>{
      console.log(responseData);
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
      console.log("message"+responseData.messsage);
      console.log("postId:"+responseData.postId);
      const updatedPosts = this.posts.filter(post=>post.id==postId);


      console.log("pushed");
      this.postUpdate.next([...this.posts]);
    });
  }

}
