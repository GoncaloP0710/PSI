import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Website } from './website';
// import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class WebsiteService {

  private websiteUrl = 'http://appserver.alunos.di.fc.ul.pt:3086/website';
  private websitesUrl = 'http://appserver.alunos.di.fc.ul.pt:3086/websites';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  /** GET websites from the server */
  getWebsites(): Observable<Website[]> {
    return this.http.get<Website[]>(this.websitesUrl)
      .pipe(
        tap(websites => console.log('Fetched websites:', websites)),
        catchError(this.handleError<Website[]>('getWebsites', []))
      );
  }

  getOrderedWebsites(sortField: string, sortOrder: string): Observable<Website[]> {
    const params = new HttpParams()
      .set('sortField', sortField)
      .set('sortOrder', sortOrder);
  
    const orderedWebsitesUrl = `${this.websitesUrl}/ordered`;
    
    return this.http.get<Website[]>(orderedWebsitesUrl, { params });
  }

  getWebsitesByAvaliacao(avaliacao: string): Observable<Website[]> {
    const params = new HttpParams().set('avaliacao', avaliacao);
    
    const byAvaliacaoWebsitesUrl = `${this.websitesUrl}/byAvaliacao`;
    
    return this.http.get<Website[]>(byAvaliacaoWebsitesUrl, { params });
  }

  /** GET website by id. Will 404 if id not found */
  getWebsite(id: string): Observable<Website> {
    const url = `${this.websiteUrl}/${id}`;
    return this.http.get<Website>(url).pipe(
      tap(),
      catchError(this.handleError<Website>(`getWebsite id=${id}`))
    );
  }

  addWebpage(websiteId: string, webpageId: string): Observable<any> {
    const url = `http://appserver.alunos.di.fc.ul.pt:3086/website/${websiteId}/webpages`;
    const body = { webpageId };
  
    return this.http.post(url, body);
  }

  /** POST: add a new website to the server */
  addWebsite(website: Website): Observable<Website> {
    return this.http.post<Website>(this.websiteUrl, website, this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<Website>('addWebsite'))
    );
  }

  /** DELETE: delete the website from the server */
  deleteWebsite(id: string): Observable<Website> {
    const url = `${this.websiteUrl}/${id}`;

    return this.http.delete<Website>(url, this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<Website>('deleteWebsite'))
    );
  }

  /** PUT: update the website on the server */
  updateWebsite(website: Website): Observable<any> {
    const url = `${this.websiteUrl}/${website._id}`;

    return this.http.put(url, website, this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>('updateWebsite'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}