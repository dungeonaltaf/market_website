import { CanActivate, Router } from '@angular/router';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
@Injectable()
export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService,private router: Router){}



  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean> | Promise<boolean>  {
      const isAuth = this.authService.getAuthStatus();
      if (!isAuth){
        this.router.navigate(['/login']);
      }
      return isAuth;
  }






}
