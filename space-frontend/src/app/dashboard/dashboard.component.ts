import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { barGraph, dashboardData, lineGraph, User } from 'src/_models';
import { lookupdata } from 'src/_models/lookup';
import { AuthService } from 'src/_services/auth.service';
import { PermissionService } from 'src/_services/permission.service';
import { DashboardService } from 'src/_services/rest/dashboard.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { UserService } from 'src/_services/rest/user.service';
import { changeDateToApiFormat } from 'src/_services/utility';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  form: FormGroup;
  userInfo: User;
  selectLease: lookupdata[] = [];
  selectAuctions: lookupdata[] = [];
  barGraph: barGraph;
  lineGraph: lineGraph;
  data: any = [];
  routeSub: Subscription;
  params: Params;
  constructor(
    private formBuilder: FormBuilder,
    private _dashboardService: DashboardService,
    private _userService: UserService,
    private _lookupService: LookUpService,
    private _authService: AuthService,
    private ps: PermissionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      lease: [''],
      auctions: ['']
    })
    this.selectLease = [{name:"Test", value:"1"}];
    this.selectAuctions = [{name:"Test", value:"1"}];
    this.routeSub = this.route.queryParams.subscribe((queryParams) => {
      this.params = queryParams;
      if (Object.keys(this.params).length > 0) {
        this.getProperty(this.params);
      }
    });
    this.getProperty();
  }

  ngOnInit(): void {}

  getProperty(params = null) {    
    const sub = this._dashboardService.getProperty(params).subscribe({
      next: (res) => {
        this.data = res['data'];
        // this.pager = this.pagination.compile(Object.assign({}, this.params, { count: res['pagination'].total }));
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  // getProperty() {
  //   const sub = this._dashboardService.getProperty().subscribe({
  //     next: (res) => {
  //       this.data = res['data'];
  //       // this.count = res['count'];
  //       sub.unsubscribe();
  //     },
  //     error: (res) => {
  //       sub.unsubscribe();
  //     },
  //   });
  // }

  // submit(): void {
  //   this.barGraph = null;
  //   if (this.form.valid) {
  //     const data = Object.assign({}, this.form.value);
  //     data.reps = this.form.value.reps
  //       ? this.form.value.reps.map((x) => x).join(',')
  //       : '';
  //     data.startDate = changeDateToApiFormat(this.form.value.startDate);
  //     data.endDate = changeDateToApiFormat(this.form.value.endDate);
  //     const sub = this._dashboardService.salesTotal(data).subscribe({
  //       next: (res) => {
  //         this.data = res['data'];
  //         sub.unsubscribe();
  //       },
  //       error: (res) => {
  //         sub.unsubscribe();
  //       },
  //     });
  //     const subSalesPerRep = this._dashboardService
  //       .salesPerRep(data)
  //       .subscribe({
  //         next: (res) => {
  //           this.barGraph = res['data'];
  //           subSalesPerRep.unsubscribe();
  //         },
  //         error: (res) => {
  //           subSalesPerRep.unsubscribe();
  //         },
  //       });
  //   }
  // }
}
