import { Component } from '@angular/core';

import { WebsiteService } from '../website.service'; // Make sure to import WebsiteService
import { AvaliacaoStatus, Website } from '../website';
import { OnInit } from '@angular/core'; // Import OnInit
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { WebpageService } from '../webpage.service'; // Make sure to import WebsiteService
import { Webpage } from '../webpage';
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatListOption, MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-websites-detail',
  templateUrl: './websites-detail.component.html',
  styleUrls: ['./websites-detail.component.css']
})
export class WebsitesDetailComponent {
  website!: Website;
  id!: string;

  webpages!: Webpage[];

  urlFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('https?://.+')
  ]);

  matcher = new ErrorStateMatcher();

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
        console.log('Websites fetched successfully:');
        this.webpages = webpages;
      },
      error => {
        console.error('Error fetching websites:', error);
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  getWebsite(id: string): void {
    this.websiteService.getWebsite(id)
      .subscribe(website => this.website = website);
  }

  addWebpageToWebsite(websiteId: string, url: string): void {
    
    this.webpageService.addWebpage({ url } as Webpage).subscribe(
      webpage => {
        this.getWebpages();
        this.websiteService.addWebpage(websiteId, webpage._id).subscribe(
          response => {
            console.log('Webpage added successfully:', response);
            this.getWebsite(this.id);
          },
          error => {
            console.error('Error adding webpage:', error);
          }
        );
      }
    );
  
  }

  evaluate(selectionList: MatSelectionList) {
    let selectedWebpages!:  string[];
    selectionList.selectedOptions.selected.forEach(option => {
      const webpageId = option.value; // Assuming the value of each option is the webpage ID
      const selectedWebpage = this.website.webpages.find(webpage => webpage._id === webpageId);
      if (selectedWebpage) {
        selectedWebpages.push(selectedWebpage._id);
      }
    });
    this.website.avaliacao = AvaliacaoStatus.EmAvaliacao;
    this.websiteService.evaluate(this.website, selectedWebpages).subscribe(
      response => {
      console.log('Website set to evaluate successfully:', response);
      this.getWebsite(this.id);
    },
    error => {
      console.error('Error evaluating:', error);
    })
    
  }

  deleteWebpages(selectionList: MatSelectionList) {
    let selectedWebpages:  string[] = [];
    selectionList.selectedOptions.selected.forEach(option => {
      const webpageId = option.value; // Assuming the value of each option is the webpage ID
      const selectedWebpage = this.website.webpages.find(webpage => webpage._id === webpageId);
      if (selectedWebpage) {
        selectedWebpages.push(selectedWebpage._id);
      }
    });
    this.webpageService.deleteWebpages(selectedWebpages).subscribe();  
    this.getWebpages();
    this.getWebsite(this.id);
  } 



}


