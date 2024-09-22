import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComparefilesService {
  private headers:any;
  private domain!: string;

  constructor(private _http: HttpClient) { }
  setHeaders() {
    this.domain = 'https://jsonplaceholder.typicode.com';
    this.headers = new HttpHeaders();
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  compareFiles(data:any){
    this.setHeaders();
    const options = {
      headers: this.headers
    };
    return this._http.post(this.domain + '/compare', data, options);
  }
}
