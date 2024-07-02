import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency/currency.service';

@Component({
  selector: 'app-currency-rates',
  templateUrl: './currency-rates.component.html',
  styleUrls: ['./currency-rates.component.css']
})
export class CurrencyRatesComponent implements OnInit {
  selectedDate: string = '';
  exchangeRates: any[] = [];
  public imageErrors: { [key: string]: boolean } = {};

  tableHeaders: string[] = ['waluta', 'nazwa', 'kurs kupna', 'kurs sprzedaży']

  constructor(private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.currencyService.exchangeRates$.subscribe(data => {
      this.exchangeRates = data;
    });
    this.currencyService.selectedDate$.subscribe(data => {
      this.selectedDate = data;
    });
  }
}