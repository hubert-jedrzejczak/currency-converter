import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CurrencyRatesComponent } from './components/currency-rates/currency-rates.component';
import { CurrencyConverterComponent } from './components/currency-converter/currency-converter.component';
import { DatePickerComponent } from './components/datepicker/datepicker.component';
import { CurrencyFlagComponent } from './components/currency-flag/currency-flag.component';

@NgModule({
  declarations: [
    AppComponent,
    CurrencyRatesComponent,
    CurrencyConverterComponent,
    DatePickerComponent,
    CurrencyFlagComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
