import { Component, OnInit, ViewChild } from '@angular/core';
import { WebsiteService } from '../website.service';
import { Website, AvaliacaoStatus } from '../website';
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSort, Sort } from '@angular/material/sort';
import { WebpageService } from '../webpage.service';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';


@Component({
  selector: 'app-websites',
  templateUrl: './websites.component.html',
  styleUrls: ['./websites.component.css']
  
})

export class WebsitesComponent implements OnInit {


  websites!: Website[];
  url: string = '';
  ascendente: boolean = false;

  displayedColumns: string[] = ['URL', "dataDeRegisto", 'dataDaUltimaAvaliacao', 'Avaliação', "Detalhe", "Apagar"];
  avalFormControl = new FormControl('');

  dataSource!: MatTableDataSource<Website>;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  avaliacao: string[] = ["Por avaliar", "Em avaliação", "Avaliado", "Erro na avaliação"];

  urlFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('https?://.+')
  ]);

  matcher = new ErrorStateMatcher();

  constructor(private websiteService: WebsiteService, private webpageService: WebpageService) { }

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
      },
      () => {
        
        this.dataSource = new MatTableDataSource<Website>(this.websites);
        this.dataSource.sort = this.sort;
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
    if(website.webpages.length != 0) {
      var userInput = confirm("Tem páginas associadas a este website!\n As páginas associadas a este website serão também eliminadas. \n Quer apagar o website?");
      if(userInput) {
        const ids = website.webpages.map(w => w._id);
        this.webpageService.deleteWebpages(ids).subscribe();
      } else {
        return;
      }
    }
    this.websites = this.websites.filter(w => w !== website);
    this.websiteService.deleteWebsite(website._id).subscribe();
  }

  getWebsitesOrdered(sortField: Sort): void {
    console.log("sortField: " + sortField.active);
    let sortOrder: string;
    if (this.ascendente) {
      sortOrder = 'asc';
      this.ascendente = false;
    } else {
      sortOrder = 'desc';
      this.ascendente = true;
    }
    console.log("sortOrder: " + sortOrder);
    console.log("Sort name " + sortField.active)

    this.websiteService.getOrderedWebsites(sortField.active, sortOrder)
      .subscribe(
        websites => {
          this.websites = websites;
          console.log('Websites ordered:', websites);
          console.log(`Received ${websites.length} websites sorted by ${sortField.active} in ${sortOrder} order`);
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