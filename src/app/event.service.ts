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

  BASEURL ='https://corsproxy.io/?https://api.hel.fi/linkedevents/v1/event/?include=location,keywords&text='

  getEvent(searchText: string, pageNumber: number): any {
    const events = this.eventHTTP.get(this.BASEURL+searchText+'&page='+pageNumber);
    return events;  
    }

    getEventId(id: string): any {
      const product = this.eventHTTP.get('https://corsproxy.io/?https://api.hel.fi/linkedevents/v1/event/?include=location,keywords&text=' + id);
      return product;
      } 
// search by date

    PAGEURL_Date = 'https://corsproxy.io/?https://api.hel.fi/linkedevents/v1/event/?start='
 
    getEventDate(searchDate: string, pageNumber: number): any {
      const events = this.eventHTTP.get(this.PAGEURL_Date+searchDate+'&end='+searchDate+'&page='+pageNumber);
      return events;  
      }


}
