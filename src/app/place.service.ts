import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private PlaceHTTP: HttpClient) { }

  getPlace(): any {
    const place = this.PlaceHTTP.get('https://api.codetabs.com/v1/proxy/?quest=https://api.hel.fi/linkedevents/v1/place/?text=ravintola');
    return place;
    }


}


