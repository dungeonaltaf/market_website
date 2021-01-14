import { Component , EventEmitter , Output, OnInit } from "@angular/core";
import { Post} from '../post.model'
import {  FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector:'app-post-create',
  templateUrl:'./post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  constructor(public postService : PostsService, public route: ActivatedRoute){
  }
  enteredTitle="";
  enteredContent="";
  error_message= "";
  private mode = 'create';
  isLoading = false;
  form:FormGroup;
  private postId: string ;
  post: Post;

  postCreated = new EventEmitter <Post>();

  ngOnInit(){
    this.form = new FormGroup({
      title: new FormControl(null,{
        validators:[Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null,{
        validators: [Validators.required]
      }),
      price: new FormControl(null,{validators: [Validators.required, Validators.min(0)]} )
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) =>{
      this.mode = 'create';
      console.log("Bhai bhai");
      this.postId = null;
      if(paramMap.has('postId')){
        console.log("inside  edit")
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData=>{
          this.isLoading = false;
          this.post = {id:postData._id,title:postData.title,
              content:postData.content,
              comments:postData.comments,
              price:postData.price};
          this.form.setValue({'title':this.post.title,
          'content': this.post.content,
          'price':this.post.price});
        });
      }
    });

  }
  onSavePost(){
    console.log("om Saved called!")
    if (this.form.invalid){
      return;
    }
    this.isLoading=true;
    if (this.mode==='create'){
      this.postService.addPosts(this.form.value.title,this.form.value.content,this.form.value.price);
    }
    else{
      this.postService.updatePost(this.postId,this.form.value.title,this.form.value.content,this.form.value.price);
    }
    this.form.reset();
  }
}
