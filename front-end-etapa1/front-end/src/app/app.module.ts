import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { WebsitesComponent } from './websites/websites.component';

import { HttpClientModule } from '@angular/common/http';
import { WebsitesDetailComponent } from './websites-detail/websites-detail.component';
import { WebpagesComponent } from './webpages/webpages.component';
import { WebpagesDetailComponent } from './webpages-detail/webpages-detail.component';

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';



const routes: Routes = [
  { path: 'websites', component: WebsitesComponent },
  { path: 'webpages', component: WebpagesComponent },
  { path: '', redirectTo: '/websites', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    WebsitesComponent,
    WebsitesDetailComponent,
    WebpagesComponent,
    WebpagesDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatTableModule,
    MatListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
