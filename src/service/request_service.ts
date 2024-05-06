import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class RequestService {
  public API = environment.API;

  constructor(private http: HttpClient) {}

  public GetRequest(path: string) {
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this.API + path, { headers: this.GetHeaders() })
        .toPromise()
        .then(
          (response) => {
            let result = response;
            resolve(result);
          },
          (msg) => {
            let result = msg;
            reject(result);
          }
        );
    });
    return promise;
  }

  public PostRequest(path: string, data: any): any {
    let promise = new Promise((resolve, reject) => {
      this.http
        .post(this.API + path, data, { headers: this.GetHeaders() })
        .toPromise()
        .then(
          (response) => {
            let result = response;
            resolve(result);
          },
          (msg) => {
            let result = msg;
            resolve(result);
          }
        );
    });
    return promise;
  }

  private GetHeaders() {
    return new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Content-Type', 'application/json')
      .set('Accept', '/')
      .set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
  }
}
