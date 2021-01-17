import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostIndexComponent } from './posts/post-index/post-index.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {path: '', component:  PostIndexComponent},
  {path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  {path: 'index', component: PostListComponent, canActivate: [AuthGuard]},
  {path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
  {path:'login',component:LoginComponent},
  {path:'signup',component:SignupComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
  providers:[AuthGuard]
})

export class AppRoutingModule {

}
