import { Component } from '@angular/core';
import { WebpageService } from '../webpage.service'; // Make sure to import WebsiteService
import { Webpage } from '../webpage';
import { OnInit } from '@angular/core'; // Import OnInit
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-webpages-detail',
  templateUrl: './webpages-detail.component.html',
  styleUrls: ['./webpages-detail.component.css']
})
export class WebpagesDetailComponent {

  webpage!: Webpage;

  constructor(private webpageService: WebpageService, private route: ActivatedRoute,private location: Location,) { } 

  ngOnInit(): void { 
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.getWebpage(id);
  }

  goBack(): void {
    this.location.back();
  }
  
  getWebpage(id: string): void {
    this.webpageService.getWebpage(id)
      .subscribe(webpage => this.webpage = webpage);
  }
}