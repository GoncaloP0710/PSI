import { Component, OnInit, ViewChild } from '@angular/core';
import { WebsiteService } from '../website.service';
import { Website, AvaliacaoStatus } from '../website';
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-websites',
  templateUrl: './websites.component.html',
  styleUrls: ['./websites.component.css']
  
})

export class WebsitesComponent implements OnInit {

  websites!: Website[];
  url: string = '';
  ascendente: boolean = false;

  avalFormControl = new FormControl('');

  avaliacao: string[] = ["Por avaliar", "Em avaliação", "Avaliado", "Erro na avaliação"];

  urlFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('https?://.+')
  ]);

  matcher = new ErrorStateMatcher();

  constructor(private websiteService: WebsiteService) { }

  ngOnInit(): void {
    this.getWebsites();
    console.log("websites na memoria: " + this.websites);
  }
  

  getWebsites(): void {
    this.websiteService.getWebsites().subscribe(
      websites => {
        console.log('Websites fetched successfully:', websites);
        this.websites = websites;
      },
      error => {
        console.error('Error fetching websites:', error);
      }
    );
    console.log("depois do fetch")
    console.log("websites na memoria: " + this.websites);
  }

  add(url: string): void {
    url = url.trim();
    if (!url) { return; }
    this.websiteService.addWebsite({ 
      url, 
      avaliacao: AvaliacaoStatus.PorAvaliar, 
      dataDeRegisto: new Date() 
    } as Website)
    .subscribe(website => {
      this.websites = [...this.websites, website];
    });
  }

  delete(website: Website): void {
    this.websites = this.websites.filter(w => w !== website);
    this.websiteService.deleteWebsite(website._id).subscribe();
  }

  getWebsitesOrdered(sortField: string): void {
    console.log("sortField: " + sortField);
    let sortOrder: string;
    if (this.ascendente) {
      sortOrder = 'asc';
      this.ascendente = false;
    } else {
      sortOrder = 'desc';
      this.ascendente = true;
    }
    console.log("sortOrder: " + sortOrder);

    this.websiteService.getOrderedWebsites(sortField, sortOrder)
      .subscribe(
        websites => {
          this.websites = websites;
          console.log('Websites ordered:', websites);
          console.log(`Received ${websites.length} websites sorted by ${sortField} in ${sortOrder} order`);
        },
        error => {
          console.error('Error occurred:', error);
        }
      );
  }

  getWebsitesByAvaliacao(avaliacao: string): void {
    this.websiteService.getWebsitesByAvaliacao(avaliacao)
      .subscribe(websites => this.websites = websites);
  }
}