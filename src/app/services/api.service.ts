import { Injectable } from '@angular/core';
import {catchError, map, Observable, of, Subject} from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environment/environment";
import {IWsMessageToGet, IWsMessageToSend} from "../models/wsMessage";
import {IHistoricData} from "../models/historic-data";

@Injectable()
export class ApiService {
  private apiKey = environment.coinApiKey;
  private baseUrl = 'https://rest.coinapi.io/v1/';
  private wsUrl = 'ws://ws.coinapi.io/v1/';
  private socket$!: WebSocketSubject<any>;
  public messages$: Subject<any> = new Subject();

  constructor(private http: HttpClient) {
  }

  public connect(filterAssetId: string) {
    this.socket$ = webSocket(this.wsUrl);

    this.socket$.pipe(
      catchError(err => {
        console.error('WebSocket error:', err);
        return of(null);
      })
    ).subscribe(
      (msg) => this.messages$.next(msg),
      (err) => console.error('WebSocket error:', err),
      () => console.warn('WebSocket connection closed')
    );

    this.sendMessage({
      "type": "hello",
      "apikey": this.apiKey,
      "subscribe_data_type": ["exrate"],
      "subscribe_update_limit_ms_exrate": 2000,
      "subscribe_filter_asset_id": [filterAssetId]
    });
  }

  public sendMessage(msg: IWsMessageToSend) {
    this.socket$.next(msg);
  }

  public close() {
    if (this.socket$) {
      this.socket$.unsubscribe();
      this.socket$.complete();
    }
  }

  getHistoricalPrices(symbol: string): Observable<IHistoricData[]> {
    const url = `${this.baseUrl}exchangerate/${symbol}/history?period_id=1HRS&limit=20&sort=DESC`;
    return this.http.get<IHistoricData[]>(url, {
      headers: {
        'X-CoinAPI-Key': this.apiKey
      }
    }).pipe(
      map((data: IHistoricData[]) => data.sort((a, b) => new Date(a.time_period_start).getTime() - new Date(b.time_period_start).getTime())),
      catchError(() => of([]))
    );
  }
}
