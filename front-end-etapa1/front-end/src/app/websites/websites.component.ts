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

  websites: Website[] = [];
  url: string = '';
  displayedColumns: string[] = ['id', 'url', 'avaliacao'];

  dataSource = new MatTableDataSource<Website>();



  @ViewChild(MatSort) sort: MatSort  = new MatSort();
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  urlFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('https?://.+')
  ]);

  matcher = new ErrorStateMatcher();


  constructor(private websiteService: WebsiteService) { }

  ngOnInit(): void {
    this.getWebsites();
    console.log(this.websites);
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  } 

  getWebsites(): void {
    this.websiteService.getWebsites()
    .subscribe(websites => this.websites = websites);
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
      this.websites.push(website);
      this.dataSource.data = this.websites; // Update the dataSource
    });
  }

  delete(website: Website): void {
    this.websites = this.websites.filter(w => w !== website);
    this.websiteService.deleteWebsite(website._id).subscribe();
  }

  
  
}