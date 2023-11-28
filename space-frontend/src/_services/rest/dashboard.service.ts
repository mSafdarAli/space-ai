import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getProperty(params = null) {
    return this.http
      .get(environment.api + 'properties', { params: params })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getPropertybyid(id: string) {
    return this.http.get(environment.api + 'properties/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  }

  // public salesTotal(data: Object) {
  //     return this.http.post(environment.api + 'Dashboard/salesTotals', data).pipe(map(res => {
  //         return res;
  //     }));
  // }
  // public salesPerRep(data: Object) {
  //     return this.http.post(environment.api + 'Dashboard/salesPerRep', data).pipe(map(res => {
  //         return res;
  //     }));
  // }
  // public salesVsTarget(data: Object) {
  //     return this.http.post(environment.api + 'Dashboard/salesVsTargetsAnnual', data).pipe(map(res => {
  //         return res;
  //     }));
  // }
  // public getRep(userId: string) {
  //     return this.http.get(environment.api + 'users/getUsersWithLinkedContacts/' + userId).pipe(map(res => {
  //         if(res['statusDescription']=='Ok'){
  //             var DataList : lookupdata[] = [];
  //             res['data'].map(e => {
  //                 DataList.push({name : e.firstName + ' ' + e.lastName , value : e.id.toString()});

  //             });
  //             return DataList;
  //         }
  //         return null
  //     }));
  // }
}
