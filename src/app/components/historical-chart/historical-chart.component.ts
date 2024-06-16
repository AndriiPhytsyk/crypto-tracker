import {Component, Input, OnInit} from '@angular/core';
import { ApiService } from '../../services/api.service';
import {ChartOptions, ChartType} from 'chart.js';
import {BaseChartDirective, provideCharts, withDefaultRegisterables} from 'ng2-charts';
import {DatePipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-historical-chart',
  standalone: true,
  templateUrl: './historical-chart.component.html',
  imports: [
    BaseChartDirective,
    NgIf
  ],
  providers: [provideCharts(withDefaultRegisterables()), DatePipe],
  styleUrls: ['./historical-chart.component.scss']
})
export class HistoricalChartComponent  {
  public lineChartData: any[] = [{ data: [], label: 'Price' }];
  public lineChartLabels: any[] = [];
  public pieChartType: ChartType = 'line';
  public lineChartLegend = true;
  chartData: any[]= [];

  @Input() set exchangeFilter(value: string) {
    this.loadHistoricalPrices(value);
  }

  constructor(private apiService: ApiService, private datePipe: DatePipe) {}

  loadHistoricalPrices(exchangeFilter: string) {
    this.apiService.getHistoricalPrices(exchangeFilter).subscribe((data: any) => {
      this.chartData = data;
      this.lineChartData[0].data = data.map((item: any) => item.rate_close);
      this.lineChartLabels = data.map((item: any) => this.datePipe.transform(item.time_period_end, 'HH:mm:ss'));    });
  }
}
