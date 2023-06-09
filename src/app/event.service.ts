import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private eventHTTP: HttpClient) { }
// free text search
  PAGEURL = 'https://corsproxy.io/?https://api.hel.fi/linkedevents/v1/event/?text='

  getEvent(searchText: string, pageNumber: number): any {
    const events = this.eventHTTP.get(this.PAGEURL+searchText+'&page='+pageNumber);
    return events;  
    }
// search by date
    PAGEURL_Date = 'https://corsproxy.io/?https://api.hel.fi/linkedevents/v1/event/?start='
 
    getEventDate(searchDate: string): any {
      const events = this.eventHTTP.get(this.PAGEURL_Date+searchDate);
      return events;  
      }


}
