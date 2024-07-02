import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency/currency.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})
export class CurrencyConverterComponent implements OnInit {
  exchangeForm: FormGroup = new FormGroup({});

  exchangeRates: any[] = [];
  currencies: string[] = ['PLN'];
  convertedAmount: number = 0;
  previousValues: { fromCurrency: string, toCurrency: string };


  constructor(private currencyService: CurrencyService, private fb: FormBuilder) {
    this.previousValues = {
      fromCurrency: 'PLN',
      toCurrency: 'EUR'
    };
  }

  ngOnInit(): void {
    this.exchangeForm = this.fb.group({
      amount: [0, Validators.required],
      fromCurrency: ['', Validators.required],
      toCurrency: ['', Validators.required],
    });
    this.exchangeForm.patchValue({ fromCurrency: 'PLN' });
    this.exchangeForm.patchValue({ toCurrency: 'EUR' });

    this.currencyService.getDataLatest();
    this.currencyService.currentExchangeRates$.subscribe(data => {
      this.exchangeRates = data;
      data.forEach((rate: any) => {
        this.currencies.push(rate.code);
      });
    });
  }

  convertCurrency(): void {
    const fromRate = this.exchangeRates.find(rate => rate.code === this.exchangeForm.get('fromCurrency')?.value);
    const toRate = this.exchangeRates.find(rate => rate.code === this.exchangeForm.get('toCurrency')?.value);

    if (this.exchangeForm.get('fromCurrency')?.value === 'PLN') {
      this.convertedAmount = this.exchangeForm.get('amount')?.value / toRate.ask;
    } else if (this.exchangeForm.get('toCurrency')?.value === 'PLN') {
      this.convertedAmount = this.exchangeForm.get('amount')?.value * fromRate.bid;
    } else {
      this.convertedAmount = (this.exchangeForm.get('amount')?.value * fromRate.bid) / toRate.ask;
    }
  }

  changeCurrencies():void {
    this.exchangeForm.patchValue({
      fromCurrency: this.previousValues.toCurrency,
      toCurrency: this.previousValues.fromCurrency
    });
    this.previousValues.fromCurrency = this.exchangeForm.get('fromCurrency')?.value;
    this.previousValues.toCurrency = this.exchangeForm.get('toCurrency')?.value;
  }

  checkCurrencies(): void {
    const fromCurrency = this.exchangeForm.get('fromCurrency')?.value;
    const toCurrency = this.exchangeForm.get('toCurrency')?.value;

    if (fromCurrency === toCurrency) {
      this.changeCurrencies();
    } else {
      this.previousValues.fromCurrency = this.exchangeForm.get('fromCurrency')?.value;
      this.previousValues.toCurrency = this.exchangeForm.get('toCurrency')?.value;
    }
  }
}