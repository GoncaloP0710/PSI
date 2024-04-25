import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { WebsitesComponent } from './websites/websites.component';

import { HttpClientModule } from '@angular/common/http';
import { WebsiteDetailComponent } from './website-detail/website-detail.component';
import { WebpagesComponent } from './webpages/webpages.component';
import { WebpageDetailComponent } from './webpage-detail/webpage-detail.component';

import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


const routes: Routes = [
  { path: 'websites', component: WebsitesComponent },
  { path: '', redirectTo: '/websites', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    WebsitesComponent,
    WebsiteDetailComponent,
    WebpagesComponent,
    WebpageDetailComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
