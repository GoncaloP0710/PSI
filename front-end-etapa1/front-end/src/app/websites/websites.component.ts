import { Component, OnInit } from '@angular/core';
import { WebsiteService } from '../website.service';
import { Website, AvaliacaoStatus } from '../website';


@Component({
  selector: 'app-websites',
  templateUrl: './websites.component.html',
  styleUrls: ['./websites.component.css']
})
export class WebsitesComponent implements OnInit {

  websites: Website[] = [];
  url: string = '';

  

  constructor(private websiteService: WebsiteService) { }

  ngOnInit(): void {
    this.getWebsites();
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
    });
  }

  delete(website: Website): void {
    this.websites = this.websites.filter(w => w !== website);
    this.websiteService.deleteWebsite(website._id).subscribe();
  }

  isUrlValid(url: string): boolean {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?'+ // port
      '(\\/[-a-z\\d%_.~+]*)*'+ // path
      '(\\?[;&amp;a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
  }
  
}