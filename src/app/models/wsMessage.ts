export interface IWsMessageToSend {
  type: string;
  apikey: string;
  subscribe_data_type: string[];
  subscribe_update_limit_ms_exrate: number;
  subscribe_filter_asset_id: string[];
}

export interface IWsMessageToGet {
  time: string;
  asset_id_base: string;
  asset_id_quote: string;
  rate_type: string;
  rate: number;
  type: string;
}
