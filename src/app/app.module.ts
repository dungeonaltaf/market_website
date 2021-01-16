import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule  } from "@angular/material/input";
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import {  MatExpansionModule} from "@angular/material/expansion";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AppComponent } from './app.component';
import { PostComponent } from './posts/post.component';
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from "./posts/post-list/post-list.component";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { PostIndexComponent } from './posts/post-index/post-index.component';
import { ReactiveFormsModule } from "@angular/forms";
import { MatPaginatorModule } from "@angular/material/paginator";
@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    PostIndexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
