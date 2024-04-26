import { Component } from '@angular/core';

import { WebsiteService } from '../website.service'; // Make sure to import WebsiteService
import { Website } from '../website';
import { OnInit } from '@angular/core'; // Import OnInit
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { WebpageService } from '../webpage.service'; // Make sure to import WebsiteService
import { Webpage } from '../webpage';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-websites-detail',
  templateUrl: './websites-detail.component.html',
  styleUrls: ['./websites-detail.component.css']
})
export class WebsitesDetailComponent {
  website!: Website;
  id!: string;

  webpages!: Webpage[];

  webpageControl = new FormControl('');

  constructor(private websiteService: WebsiteService, private route: ActivatedRoute,private location: Location,private webpageService: WebpageService) { } 

  ngOnInit(): void { 
    this.id = String(this.route.snapshot.paramMap.get('id'));
    this.getWebsite(this.id);
    this.getWebpages();
  }

  getWebpages(): void {
    this.webpageService.getWebpages().subscribe(
      webpages => {
        console.log('Websites fetched successfully:', webpages);
        this.webpages = webpages;
      },
      error => {
        console.error('Error fetching websites:', error);
      }
    );
    console.log("depois do fetch")
    console.log("websites na memoria: " + this.webpages);
  }

  goBack(): void {
    this.location.back();
  }

  getWebsite(id: string): void {
    this.websiteService.getWebsite(id)
      .subscribe(website => this.website = website);
  }

  addWebpageToWebsite(websiteId: string, webpageId: string): void {
    this.websiteService.addWebpage(websiteId, webpageId).subscribe(
      response => {
        console.log('Webpage added successfully:', response);
        this.getWebsite(this.id);
      },
      error => {
        console.error('Error adding webpage:', error);
      }
    );
  }

}


