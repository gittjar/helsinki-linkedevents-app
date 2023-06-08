import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private eventHTTP: HttpClient) { }

  PAGEURL = 'https://api.codetabs.com/v1/proxy/?quest=https://api.hel.fi/linkedevents/v1/event/'

  getEvent(): Observable<any> {
    const events = this.eventHTTP.get<any>(this.PAGEURL);
    return events;  
    } 

}
