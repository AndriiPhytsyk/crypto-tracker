import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MarketDataComponent} from "../market-data/market-data.component";
import {HistoricalChartComponent} from "../historical-chart/historical-chart.component";

@Component({
  selector: 'app-crypto-tracker',
  standalone: true,
  imports: [
    FormsModule, MarketDataComponent, HistoricalChartComponent
  ],
  templateUrl: './crypto-tracker.component.html',
  styleUrl: './crypto-tracker.component.scss'
})
export class CryptoTrackerComponent {
  exchangeFilter = 'BTC/USD';

  subscribe(symbol: string) {
    console.log(symbol);
    this.exchangeFilter = symbol;
  }
}
