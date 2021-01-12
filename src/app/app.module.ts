import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule  } from "@angular/material/input";
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import {  MatExpansionModule} from "@angular/material/expansion";
import { AppComponent } from './app.component';
import { PostComponent } from './posts/post.component';
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from "./posts/post-list/post-list.component";

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
