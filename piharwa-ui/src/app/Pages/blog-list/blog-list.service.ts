import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConstants } from 'src/app/api-path/api-config';

@Injectable({
  providedIn: 'root'
})
export class BlogListService {

  constructor(private http: HttpClient) { }
  ngOnInit() {

  }
  blogListApi() {
    return this.http.get(ApiConstants.apiURL + ApiConstants.blogListApi);
  }

  blogDetialsApi(id: any) {
    return this.http.get(ApiConstants.apiURL + ApiConstants.blogDetailsApi + id);
  }


}
