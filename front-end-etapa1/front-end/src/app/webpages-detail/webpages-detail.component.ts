import { Component } from '@angular/core';
import { WebpageService } from '../webpage.service'; // Make sure to import WebsiteService
import { Webpage } from '../webpage';
import { OnInit } from '@angular/core'; // Import OnInit
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


interface Filter {
  actRules: boolean;
  wcagTechique: boolean;
  AFilter: boolean;
  AAFilter: boolean;
  AAAFilter: boolean;
  result: string;
}

@Component({
  selector: 'app-webpages-detail',
  templateUrl: './webpages-detail.component.html',
  styleUrls: ['./webpages-detail.component.css']
})


export class WebpagesDetailComponent {

  webpage!: Webpage;
  stats!: any[];
  displayedColumns: string[] = ['Descricao','Total','Percentagem'];


  filters: Filter = {
    actRules: false,
    wcagTechique: false,
    AFilter: false,
    AAFilter: false,
    AAAFilter: false,
    result: ""
  };
  

  constructor(private webpageService: WebpageService, private route: ActivatedRoute,private location: Location,) { } 

  ngOnInit(): void { 
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.getWebpage(id);
  }

  initializeStats(): void {
    this.stats = [
      {
        Descricao: "Testes passados",
        Total: this.webpage.passed,
        Percentagem: Math.round(this.webpage.percentagePassed * 100) / 100
      },
      {
        Descricao: "Testes não aplicáveis",
        Total: this.webpage.inapplicable,
        Percentagem: Math.round(this.webpage.percentageInapplicable * 100) / 100
      },
      {
        Descricao: "Avisos",
        Total: this.webpage.warning,
        Percentagem: Math.round(this.webpage.percentageWarning * 100) / 100
      },
      {
        Descricao: "Testes falhados",
        Total: this.webpage.failed,
        Percentagem: Math.round(this.webpage.percentageFailed * 100) / 100
      },
    ];
  }

  goBack(): void {
    this.location.back();
  }
  
  getWebpage(id: string): void {
    this.webpageService.getWebpage(id)
      .subscribe(webpage => {this.webpage = webpage;
        this.initializeStats()}
      );
  }

  deleteWebpage() {
    const id: string[] = [this.webpage._id];
    this.webpageService.deleteWebpages(id).subscribe(); 
    this.goBack();
  }

  filterTests() {
    const filters = {
      actrules: this.filters.actRules,
      wcagTechnique: this.filters.wcagTechique,
      AFilter: this.filters.AFilter,
      AAFilter: this.filters.AAFilter,
      AAAFilter: this.filters.AAAFilter,
      result: this.filters.result
    };

    this.webpageService.filterTests(this.webpage, filters.actrules, filters.wcagTechnique, filters.result,
      filters.AFilter, filters.AAFilter, filters.AAAFilter
    ).subscribe(test => this.webpage.test = test);
  }
}