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
              imagePath: null};
          this.form.setValue({'title':this.post.title,
          'content': this.post.content,
          'price':this.post.price});
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
    console.log("on Saved called!")
    if (this.form.invalid){
      console.log("form is invalid what to do ?!")
      return;
    }
    this.isLoading=true;
    if (this.mode==='create'){
      console.log("inside create form function title:"+this.form.value.title);
      console.log("inside create form function"+this.form.value.images);
      this.postService.addPosts(this.form.value.title,this.form.value.content,this.form.value.price, this.form.value.images);
    }
    else{
      this.postService.updatePost(this.postId,this.form.value.title,this.form.value.content,this.form.value.price);
    }
    this.form.reset();
  }
}
