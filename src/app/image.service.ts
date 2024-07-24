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
  private IMGURL = 'https://api.codetabs.com/v1/proxy/?quest=https://api.hel.fi/linkedevents/v1/image/';

  constructor(private http: HttpClient) { }

  getImages(page: number = 1, searchText: string = '', sort: string = ''): Observable<any> {
    let url = `${this.IMGURL}?page=${page}`;

    if (searchText) {
      url += `&text=${encodeURIComponent(searchText)}`;
    }

    if (sort) {
      url += `&sort=${encodeURIComponent(sort)}`;
    }

    return this.http.get<any>(url);
  }
}