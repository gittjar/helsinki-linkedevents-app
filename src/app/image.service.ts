import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private imageHTTP: HttpClient) { }

  IMGURL = 'https://api.codetabs.com/v1/proxy/?quest=https://api.hel.fi/linkedevents/v1/image/?page='

  getImages(page: number): Observable<any> {
    const ImageUrl = this.imageHTTP.get<any>(this.IMGURL+page);
    return ImageUrl;
  }


}
