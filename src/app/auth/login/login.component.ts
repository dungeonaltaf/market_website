import {Component} from "@angular/core";
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
@Component({
 templateUrl:'./login.component.html',
 styleUrls:['./login.component.css']
})
export class LoginComponent{
  isLoading = false;

  constructor(public authService: AuthService){

  }


  onLogin(form :NgForm){
    if (form.invalid){
      // console.log(form.value);
      // console.log("login form invalid what to do!");
      return
    }
    this.isLoading = true;
    this.authService.login(form.value.email,form.value.password);


  }

 }
