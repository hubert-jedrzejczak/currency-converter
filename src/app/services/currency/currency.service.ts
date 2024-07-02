import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'http://api.nbp.pl/api/exchangerates/tables/c';
  private tableUrlC = 'http://api.nbp.pl/api/exchangerates/tables/c';

  private selectedDate: BehaviorSubject<string>;
  private exchangeRates: BehaviorSubject<any[]>;
  private currentExchangeRates: BehaviorSubject<any[]>;

  public selectedDate$: Observable<string>;
  public exchangeRates$: Observable<any[]>;
  public currentExchangeRates$: Observable<any[]>;

  constructor(private http: HttpClient) {
    this.selectedDate = new BehaviorSubject<string>('');
    this.exchangeRates = new BehaviorSubject<any[]>([]);
    this.currentExchangeRates = new BehaviorSubject<any[]>([]);

    this.selectedDate$ = this.selectedDate.asObservable();
    this.exchangeRates$ = this.exchangeRates.asObservable();
    this.currentExchangeRates$ = this.exchangeRates.asObservable();
  }

  getCurrentRates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.tableUrlC}/last/?format=json`).pipe(
      map(response => response[0].rates),
      catchError(error => {
        throw error;
      })
    );
  }

  getRatesForDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${date}/?format=json`).pipe(
      map(response => response[0].rates),
      catchError(error => {
        throw error;
      })
    );
  }

  getDataUntilSuccess(selectedDate: string, retries: number = 7): Observable<any> {
    let date = new Date(selectedDate);

    const attempt = (remainingRetries: number): Observable<any> => {
      if (remainingRetries === 0) {
        return throwError(new Error('Exceeded number of retries'));
      }

      const dateStr = date.toISOString().split('T')[0];
      return this.getRatesForDate(dateStr).pipe(
        catchError(() => {
          date.setDate(date.getDate() - 1);
          return of(null).pipe(
            delay(10),
            concatMap(() => attempt(remainingRetries - 1))
          );
        }),
        concatMap((data) => {
          this.selectedDate.next(dateStr);
          return of(data);
        })
      );
    };

    return attempt(retries);
  }

  getDataForDate(date: string) {
    this.selectedDate.next(date);
    this.getDataUntilSuccess(date).subscribe(data => {
      this.exchangeRates.next(data);
    });
  }

  getDataLatest() {
    this.getCurrentRates().subscribe(data => {
      this.currentExchangeRates.next(data);
    });
  }

}