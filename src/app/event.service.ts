import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private eventHTTP: HttpClient) { }

  private readonly API_ROOT = 'https://api.hel.fi/linkedevents/v1/';

  getEvent(searchText: string, pageNumber: number): any {
    const target = `${this.API_ROOT}event/?include=location,keywords&text=${encodeURIComponent(searchText)}&page=${pageNumber}`;
    return this.eventHTTP.get(target);
  }

  getEventId(id: string): any {
    const target = `${this.API_ROOT}event/?include=location,keywords&text=${encodeURIComponent(id)}`;
    return this.eventHTTP.get(target);
  }

  getEventDate(searchDate: string, pageNumber: number): any {
    const target = `${this.API_ROOT}event/?start=${searchDate}&end=${searchDate}&page=${pageNumber}`;
    return this.eventHTTP.get(target);
  }


}
