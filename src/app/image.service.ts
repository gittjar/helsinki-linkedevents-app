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

  constructor(private imageHTTP: HttpClient) { }

  getImages(page: number = 1, searchText: string = '', sort: string = '', lastModifiedSort: 'asc' | 'desc' | '' = ''): Observable<any> {
    let url = this.IMGURL;
    const queryParams = [];

    if (searchText) {
      queryParams.push(`text=${encodeURIComponent(searchText)}`);
    } else {
      queryParams.push(`page=${page}`);
    }

    if (sort) {
      queryParams.push(`sort=${encodeURIComponent(sort)}`);
    }

    // Add last_modified_time sorting if specified
    if (lastModifiedSort) {
      queryParams.push(`last_modified_time=${encodeURIComponent(lastModifiedSort)}`);
    }

    if (queryParams.length) {
      url += `?${queryParams.join('&')}`;
    }

    return this.imageHTTP.get<any>(url);
  }
}