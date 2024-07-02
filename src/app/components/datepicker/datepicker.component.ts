import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CurrencyService } from '../../services/currency/currency.service';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatePickerComponent implements OnInit {
  @Output() dateSelected = new EventEmitter<{ date: string }>();
  @ViewChild('submitButton') submitButton?: ElementRef;

  dateForm: FormGroup = new FormGroup({});
  selectedDate?: string;
  maxDate = new Date().toISOString().split('T')[0];

  constructor(private currencyService: CurrencyService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.dateForm = this.fb.group({
      date: [''],
    });
    this.dateForm.patchValue({date: this.maxDate});
    this.onSubmit();
  }

  onSubmit(): void {
    this.currencyService.getDataForDate(this.dateForm.get('date')?.value);
  }
}
