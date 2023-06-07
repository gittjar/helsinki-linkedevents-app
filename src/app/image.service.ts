import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

interface ImageResponse {
  meta: {
    count: number;
    next: string;
    previous: string;
  };
}

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

  getImageData(): Observable<ImageResponse> {
    return this.imageHTTP.get<ImageResponse>('https://api.codetabs.com/v1/proxy/?quest=https://api.hel.fi/linkedevents/v1/image/');
  }

  getPageNumber(url: string): number {
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }
  
  getMaxPageNumber(url: string): number {
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }


}
