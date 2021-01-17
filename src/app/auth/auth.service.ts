import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User} from './user.model'
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import {Router} from '@angular/router';

import {environment} from "../../environments/environment";
const BACKEND_URL = environment.apiUrl + "/user"
@Injectable({
  providedIn: "root"
})
export class AuthService{

  private token: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router){}
  private tokenTimer: any;

  createUser(email:string,password:string,phone:number,firstName:string,secondName:string){
    const user :   User = {email: email, password:password,phone:phone,firstName:firstName,secondName:secondName}
    this.http.post(BACKEND_URL+"/signup",user).subscribe(response => {
      // console.log("token:"+response);
      this.router.navigate(['/index']);
    })
  }

  getToken(){
    return this.token;
  }

  getAuthStatus(){

    return this.isAuthenticated;

  }
  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  login(email:string,password:string){
    const authData: AuthData = {email:email,password:password}

    this.http.post<{token: string, expiresIn : number}>(BACKEND_URL+"/login",authData).subscribe(response=>{
      const token = response.token;
      this.token = token;
      // console.log(response);
      if (token){
        const expiresInDuration = response.expiresIn;
        // console.log(expiresInDuration);
        this.setAuthTime(expiresInDuration);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime()+ expiresInDuration*1000);
        this.saveAuthData(token,expirationDate);
        // console.log("local storgae expires on:"+expirationDate);
        this.router.navigate(['/index']);
      }
    });

  }



  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }

  autoAuthUser(){
    const authData = this.getAuthData();
    if(!authData){
      return;
    }
    const now = new Date();
    const expiresIn =  authData.expirationDate.getTime() - now.getTime() ;
    if (expiresIn>0){
      this.token = authData.token;
      this.isAuthenticated = true;
      this.setAuthTime(expiresIn/1000);
      this.authStatusListener.next(true);

    }
  }


  private setAuthTime(duration : number){
    // console.log("setTimer:"+duration)
    this.tokenTimer = setTimeout(() =>{
      this.logout();
    },duration*1000);
  }
  private saveAuthData(token:string,expirationDate:Date){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData(){
      localStorage.removeItem('token');
      localStorage.removeItem('expiration');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate){
      return;
    }
    return {
      token : token,
      expirationDate: new Date(expirationDate)
    }
  }
}
