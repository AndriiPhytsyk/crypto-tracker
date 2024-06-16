import { Injectable } from '@angular/core';
import {catchError, Observable, of, Subject} from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environment/environment";
import {IWsMessageToGet, IWsMessageToSend} from "../models/wsMessage";

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

  getHistoricalPrices(symbol: string): Observable<any[]> {
    const url = `${this.baseUrl}quotes/${symbol}/history?period_id=1DAY&limit=20`;
    return this.http.get<any[]>(url, {
      headers: {
        'X-CoinAPI-Key': this.apiKey
      }
    }).pipe(catchError(() => of([])));
  }
}
