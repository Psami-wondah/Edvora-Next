export type PayLoad = {
  status: boolean;
  message: string;
};
export type User = {
  station_code: number;
  name: string;
  url: string;
};
export type Ride = {
  id: number;
  origin_station_code: number;
  station_path: Array<number>;
  destination_station_code: number;
  date: string;
  map_url: string;
  state: string;
  city: string;
  distance: number;
};
