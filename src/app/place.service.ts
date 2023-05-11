import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  private linkedEventsApiRoot = 'https://api.codetabs.com/v1/proxy/?quest=https://api.hel.fi/linkedevents/v1';

  constructor(private PlaceHTTP: HttpClient) { }
  
/*
  getPlace(): any {
    const place = this.PlaceHTTP.get('https://api.codetabs.com/v1/proxy/?quest=https://api.hel.fi/linkedevents/v1/place/?text=ravintola');
    return place;
    }*/
    
          
          // loads 1000 first items
         // PAGEURL = 'https://api.codetabs.com/v1/proxy/?quest=https://api.hel.fi/linkedevents/v1/place/?page_size=1000&current_page=1&text='
          
         PAGEURL = 'https://api.codetabs.com/v1/proxy/?quest=https://api.hel.fi/linkedevents/v1/place/?text=';
         getPlace(textid: string): Observable<any> {
          //  const PlaceText = this.PlaceHTTP.get<any>(this.PAGEURL+textid+'&division='+this.getDivisionId());
          const PlaceText = this.PlaceHTTP.get<any>(this.PAGEURL+textid);
          return PlaceText;  
          } 

          public getPlaceImageById(imageId: number): Observable<any> {
            // First fetch the image data
            return this.PlaceHTTP.get<any>(`${this.linkedEventsApiRoot}/image/${imageId}`)
          }

}


