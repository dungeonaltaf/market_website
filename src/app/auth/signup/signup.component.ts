import {  Component, OnInit, OnDestroy} from "@angular/core";
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl:'./signup.component.html',
  styleUrls: ['./signup.component.css'],
  selector: 'app-post-signup'
})

export class SignupComponent implements OnInit,OnDestroy{
  mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";

  isLoading = false;
  private authStatusSub: Subscription;
  constructor(public authService: AuthService){}

  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus =>{
        this.isLoading = false;
      }
    );
  }


  onSignup(form : NgForm){
    if (form.invalid){
      // console.log("form is invalid!");
      return;
    }
    // console.log("inside the form bruh")
    let email = form.value.email;
    let password = form.value.password;
    let firstName = form.value.firstName;
    let secondName = form.value.secondName;
    let phone = form.value.phone;
    this.isLoading = true;
    this.authService.createUser(email,password,phone,firstName,secondName);
    // console.log(form.value);
  }


  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}
