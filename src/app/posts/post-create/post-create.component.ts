import { Component , EventEmitter , Output, OnInit } from "@angular/core";
import { Post} from '../post.model'
import {  FormGroup, FormControl, Validators, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
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
  imagePreviews = [];
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
      comments: new FormControl(null,{
        validators: []
      }),
      price: new FormControl(null,{validators: [Validators.required, Validators.min(0)]}),
      images : new FormControl(null,{validators:[Validators.required],asyncValidators:[mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) =>{
      this.mode = 'create';
      this.postId = null;
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData=>{
          this.isLoading = false;
          this.post = {id:postData._id,title:postData.title,
              content:postData.content,
              comments:postData.comments,
              price:postData.price,
              imagePath: postData.imagePath};
          this.form.setValue({'title':this.post.title,
          'content': this.post.content,
          'price':this.post.price,
          'comments': this.post.comments,
          'images':this.post.imagePath});
        });
      }
    });

  }


  onImagePicked(event: Event){
    const files = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({images:files})
    this.form.get('images').updateValueAndValidity;
    // let fileArray = Array.from(files);
    // if (files === undefined){
    //   return;
    // }
    // for (let file of fileArray){
    //   // this.form.patchValue({images:file});

      let reader = new FileReader;
      reader.onload = () => {
        this.imagePreviews.push(reader.result as string);
      };
      reader.readAsDataURL(files);
    // }
    // if ((event.target as HTMLInputElement).files){
    //   for (let i=0;i<(event.target as HTMLInputElement).files.length;i++){
    //     var reader = new FileReader();
    //     reader.readAsDataURL((event.target as HTMLInputElement).files[i]);
    //     reader.onload=(events:any)=>{
    //       this.imagePreviews.push(events.target.result);
    //     }
    //   }
    // }

  }
  onSavePost(){
    if (this.form.invalid){
      return;
    }
    this.isLoading=true;
    let title = this.form.value.title;
    let content = this.form.value.content;
    let price = this.form.value.price;
    let images = this.form.value.images;
    let postId = this.postId;
    if (this.mode==='create'){
      this.postService.addPosts(title,content,price,images);
    }
    else{
      this.postService.updatePost(postId,title,content,price,images);
    }
    this.form.reset();
  }
}
