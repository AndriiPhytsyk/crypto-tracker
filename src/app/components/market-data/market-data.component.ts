import {Component, Input, OnDestroy} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-market-data',
  standalone: true,
  templateUrl: './market-data.component.html',
  imports: [
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./market-data.component.scss']
})
export class MarketDataComponent implements  OnDestroy {
  private _exchangeFilter: string = '';
  @Input() set exchangeFilter(value: string) {
    this._exchangeFilter = value;
    this.apiService.close();
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    this.apiService.connect(value);
    this.subscribeToWebSocket();
  }
  price: string = '';
  time: string = '';
  private socketSubscription!: Subscription;

  constructor(private apiService: ApiService) {}

  subscribeToWebSocket() {
    this.socketSubscription = this.apiService.messages$.subscribe(message => {
      if (message) {
        const { time, rate } = message;
        this.time = time;
        this.price = rate;
      }

    });
  }

  get exchangeFilter() {
    return this._exchangeFilter;
  }

  ngOnDestroy() {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    this.apiService.close();
  }
}
