import { Injectable } from '@angular/core';
import { Webpage } from './webpage';
import { catchError, forkJoin, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebpageService {

  

  private webpageUrl = 'http://localhost:8000/webpage';
  private webpagesUrl = 'http://localhost:8000/webpages';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(
    private http: HttpClient) { }

  getWebpages(): Observable<Webpage[]> {
    return this.http.get<Webpage[]>(this.webpagesUrl)
      .pipe(
        tap(webpages => console.log('Fetched webpages:', webpages)),
        catchError(this.handleError<Webpage[]>('getWebpages', []))
      );
  }

  /** GET webpage by id. Will 404 if id not found */
  getWebpage(id: string): Observable<Webpage> {
    const url = `${this.webpageUrl}/${id}`;
    return this.http.get<Webpage>(url).pipe(
      tap(),
      catchError(this.handleError<Webpage>(`getWebpage id=${id}`))
    );
  }

  /** POST: add a new webpage to the server */
  addWebpage(webpage: Webpage): Observable<Webpage> {
    return this.http.post<Webpage>(this.webpageUrl, webpage, this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<Webpage>('addWebpage'))
    );
  }

  /** DELETE: delete the webpage from the server */
  deleteWebpage(id: string): Observable<Webpage> {
    const url = `${this.webpageUrl}/${id}`;

    return this.http.delete<Webpage>(url, this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<Webpage>('deleteWebpage'))
    );
  }

  deleteWebpages(webpageIds: string[]): Observable<Webpage> {

    const url = `${this.webpageUrl}/`;

    let options = {
      headers: this.httpOptions.headers,
      body: {webpageIds}
    }
    return this.http.delete<Webpage>(url, options).pipe(
      tap(),
      catchError(this.handleError<Webpage>('deleteWebpage'))
    );
  }

  /** PUT: update the webpage on the server */
  updateWebpage(webpage: Webpage): Observable<any> {
    const url = `${this.webpageUrl}/${webpage._id}`;

    return this.http.put(url, webpage, this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>('updateWebpage'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
