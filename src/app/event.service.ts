import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private eventHTTP: HttpClient) { }

  private readonly PROXY = 'https://api.codetabs.com/v1/proxy/?quest=';
  private proxyUrl(targetUrl: string): string {
    return this.PROXY + encodeURIComponent(targetUrl);
  }

  getEvent(searchText: string, pageNumber: number): any {
    const target = `https://api.hel.fi/linkedevents/v1/event/?include=location,keywords&text=${encodeURIComponent(searchText)}&page=${pageNumber}`;
    return this.eventHTTP.get(this.proxyUrl(target));
  }

  getEventId(id: string): any {
    const target = `https://api.hel.fi/linkedevents/v1/event/?include=location,keywords&text=${encodeURIComponent(id)}`;
    return this.eventHTTP.get(this.proxyUrl(target));
  }

  getEventDate(searchDate: string, pageNumber: number): any {
    const target = `https://api.hel.fi/linkedevents/v1/event/?start=${searchDate}&end=${searchDate}&page=${pageNumber}`;
    return this.eventHTTP.get(this.proxyUrl(target));
  }


}
