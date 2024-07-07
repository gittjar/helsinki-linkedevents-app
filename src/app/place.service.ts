import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private linkedEventsApiRoot = 'https://api.codetabs.com/v1/proxy/?quest=https://api.hel.fi/linkedevents/v1/';

  constructor(private http: HttpClient) { }
  
  public getPlace(textid: string, pageNumber: number = 1): Observable<any> {
    const pageUrl = `${this.linkedEventsApiRoot}place/?text=${textid}&page=${pageNumber}`;
    return this.http.get<any>(pageUrl);
  }

  public getPlaceImageById(imageId: number): Observable<any> {
    return this.http.get<any>(`${this.linkedEventsApiRoot}image/${imageId}`);
  }

  // Method to fetch data from a given URL for pagination
  getPlacesByUrl(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
}