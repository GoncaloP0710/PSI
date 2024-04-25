import { Component, OnInit, ViewChild } from '@angular/core';
import { WebsiteService } from '../website.service';
import { Webpage} from '../webpage';
import { Website } from '../website';
import { WebpageService } from '../webpage.service';
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-webpages',
  templateUrl: './webpages.component.html',
  styleUrls: ['./webpages.component.css']
})

export class WebpagesComponent {

  webpages!: Webpage[];
  url: string = '';

  urlFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('https?://.+')
  ]);

  matcher = new ErrorStateMatcher();

  constructor(private webpageService: WebpageService) { }

  ngOnInit(): void {
    this.getWebpages();
    console.log("webpages na memoria: " + this.webpages);
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

  add(url: string): void {
    url = url.trim();
    if (!url) { return; }
    this.webpageService.addWebpage({ url } as Webpage)
      .subscribe(webpage => {
        this.webpages = [...this.webpages, webpage];
      });
  }

  delete(webpage: Webpage): void {
    this.webpages = this.webpages.filter(w => w !== webpage);
    this.webpageService.deleteWebpage(webpage._id).subscribe();
  }
}

