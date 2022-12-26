import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import {
  DataFormService,
  FormatMapMime
} from "@geonature_common/form/data-form.service";
import { Observable } from "rxjs";

import { AppConfig } from "@geonature_config/app.config";
import { ModuleConfig } from "../module.config";
import { StationFeature, StationFeatureCollection } from "../models";

@Injectable()
export class OccHabDataService {
  private OCCHAB_API = `${AppConfig.API_ENDPOINT}/occhab`;

  constructor(
    private _http: HttpClient,
    private _gnDataService: DataFormService
  ) {}

  listStations(params = {}): Observable<StationFeatureCollection> {
    params['format'] = 'geojson';
    return this._http.get<StationFeatureCollection>(
      `${this.OCCHAB_API}/stations/`,
      { params: params },
    );
  }

  createStation(station: StationFeature, params = {}): Observable<StationFeature> {
    params['format'] = 'geojson';
    return this._http.post<StationFeature>(
      `${this.OCCHAB_API}/stations/`,
      station,
      { params: params },
    );
  }

  getStation(stationId: number, params = {}): Observable<StationFeature> {
    params['format'] = 'geojson';
    return this._http.get<StationFeature>(
      `${this.OCCHAB_API}/stations/${stationId}/`
    );
  }

  updateStation(station: StationFeature, params = {}): Observable<StationFeature> {
    params['format'] = 'geojson';
    let stationId = station['id_station'];
    return this._http.post<StationFeature>(
      `${this.OCCHAB_API}/stations/${stationId}/`,
      station,
      { params: params },
    );
  }

  deleteStation(stationId, params = {}): Observable<any> {
    return this._http.delete(
      `${this.OCCHAB_API}/stations/${stationId}/`,
      { params: params },
    );
  }

  exportStations(export_format, idsStation?: Array<number>) {
    const sub = this._http.post(
      `${this.OCCHAB_API}/export_stations/${export_format}`,
      { idsStation: idsStation },
      {
        observe: "events",
        responseType: "blob",
        reportProgress: true
      }
    );
    this._gnDataService.subscribeAndDownload(sub, "export_hab", export_format);
  }
}
