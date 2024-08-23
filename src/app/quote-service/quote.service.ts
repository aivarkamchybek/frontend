import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote } from '../Interfaces/Quote'; // Adjust the path as necessary

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  private apiUrl = 'https://localhost:44353//api/quotes'; // Adjust the URL as needed

  constructor(private http: HttpClient) { }

  getAllQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.apiUrl);
  }

  getById(id: number): Observable<Quote> {
    return this.http.get<Quote>(`${this.apiUrl}/${id}`)
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  createQuote(quote: Quote): Observable<Quote>{
    return this.http.post<Quote>(this.apiUrl, quote)
  }

  editQuote(id: number, quote: Quote): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, quote);
  }
}
