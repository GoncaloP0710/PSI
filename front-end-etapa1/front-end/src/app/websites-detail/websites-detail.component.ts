import { Component } from '@angular/core';

import { WebsiteService } from '../website.service'; // Make sure to import WebsiteService
import { AvaliacaoStatus, Website } from '../website';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { WebpageService } from '../webpage.service'; // Make sure to import WebsiteService
import { Webpage } from '../webpage';
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSelectionList } from '@angular/material/list';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-websites-detail',
  templateUrl: './websites-detail.component.html',
  styleUrls: ['./websites-detail.component.css']
})
export class WebsitesDetailComponent {
  website!: Website;
  id!: string;
  displayedColumns :string[] = ['Descrição', 'Total', 'Percentagem'];

  stats!: any[];

  webpages: Webpage[] = [];

  urlFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('https?://.+')
  ]);

  matcher = new ErrorStateMatcher();

  webpageControl = new FormControl('');

  selection = new SelectionModel<any>(true, []);
  displayedColumns2: string[] = ['URL', 'Detalhes', 'select'];
  

  constructor(private websiteService: WebsiteService, private route: ActivatedRoute,private location: Location,private webpageService: WebpageService) { } 

  ngOnInit(): void { 
    this.id = String(this.route.snapshot.paramMap.get('id'));
    this.getWebsite(this.id);
    this.getWebpages();
    
  }

  initializeStats(): void {
    this.stats = [
      {
        Descricao: "Páginas sem erros de acessibilidade",
        Total: this.website.countNone,
        Percentagem: this.website.percentageNone
      },
      {
        Descricao: "Páginas com pelo menos um erro de acessibilidade",
        Total: this.website.countAny,
        Percentagem: this.website.percentageAny
      },
      {
        Descricao: "Páginas com pelo menos um erro de acessibilidade de nível A",
        Total: this.website.countA,
        Percentagem: this.website.percentageCountA
      },
      {
        Descricao: "Páginas com pelo menos um erro de acessibilidade de nível AA",
        Total: this.website.countAA,
        Percentagem: this.website.percentageCountAA
      },
      {
        Descricao: "Páginas com pelo menos um erro de acessibilidade de nível AAA",
        Total: this.website.countAAA,
        Percentagem: this.website.percentageCountAAA
      }
    ];
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
      .subscribe(website => {this.website = website;
        this.initializeStats();
      });
      
  }

  deleteWebsite() {
    if(this.website.webpages.length != 0) {
      var userInput = confirm("Tem páginas associadas a este website!\n As páginas associadas a este website serão também eliminadas. \n Quer apagar o website?"
      );
      if(userInput) {
        const ids = this.website.webpages.map(w => w._id);
        this.webpageService.deleteWebpages(ids).subscribe();
      } else {
        return;
      }
    }
    this.websiteService.deleteWebsite(this.id).subscribe();
    this.goBack();
  }

  addWebpageToWebsite(websiteId: string, url: string): void {
    
    this.webpageService.addWebpage({ url } as Webpage).subscribe(
      webpage => {
        this.webpages = [...this.webpages, webpage];
        this.websiteService.addWebpage(websiteId, webpage._id).subscribe(
          response => {
            console.log('Webpage added successfully:', response);
            this.website.webpages = [...this.website.webpages, webpage];
          },
          error => {
            console.error('Error adding webpage:', error);
          }
        );
      }
    );
  
  }

  evaluate() {
    let selectedWebpages:  string[] = [];
    this.selection.selected.forEach(option => {
      const webpageId = option._id; // Assuming the value of each option is the webpage
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
      this.getWebpages();
      this.initializeStats();
      this.website.topTenErrors = response;
    },
    error => {
      console.error('Error evaluating:', error);
    })
    this.selection.clear();
  }

  deleteWebpages() {
    let selectedWebpages:  string[] = [];
    this.selection.selected.forEach(option => {
      const webpageId = option._id; // Assuming the value of each option is the webpage
      const selectedWebpage = this.website.webpages.find(webpage => webpage._id === webpageId);
      if (selectedWebpage) {
        selectedWebpages.push(selectedWebpage._id);
      } 
    });
    this.webpages = this.webpages.filter(w => !selectedWebpages.includes(w._id));
    this.website.webpages = this.website.webpages.filter(w => !selectedWebpages.includes(w._id));
    this.webpageService.deleteWebpages(selectedWebpages).subscribe(() => {
      this.websiteService.updateEval(this.website).subscribe(() => {this.getWebsite(this.id);
      this.initializeStats()});
      }); 
      this.selection.clear();
  } 



}


