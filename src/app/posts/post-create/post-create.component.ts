import { Component , EventEmitter , Output } from "@angular/core";
import { Post} from '../post.model'
import { NgForm } from '@angular/forms';
import { PostsService } from "../posts.service";
@Component({
  selector:'app-post-create',
  templateUrl:'./post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent{
  constructor(public postService : PostsService){
  }
  enteredTitle="";
  enteredContent="";
  error_message= "";
  postCreated = new EventEmitter <Post>();
  onAddPost(form : NgForm){
    if (form.invalid){
      return;
    }
    this.postService.addPosts(form.value.title,form.value.content);
    form.resetForm();
  }
}
