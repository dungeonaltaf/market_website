import { Post } from "./post.model";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Subject } from "rxjs";

@Injectable({
  providedIn:'root'
})
export class PostsService{
  private posts: Post[] = [];
  private postUpdate = new Subject<Post[]>();

  getPosts(){
    console.log("post"+this.posts)
    return [...this.posts];
  }

  getPostUpdateListener(){
    return this.postUpdate.asObservable();
  }
  addPosts(title: string, content: string){
    const post: Post = {title:title,content:content};
    this.posts.push(post)
    console.log("pushed");
    this.postUpdate.next([...this.posts])
  }

}
