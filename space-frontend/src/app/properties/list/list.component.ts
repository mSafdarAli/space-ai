import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/_models';
import { lookupdata } from 'src/_models/lookup';
import { AuthService } from 'src/_services/auth.service';
import { PermissionService } from 'src/_services/permission.service';
import { DashboardService } from 'src/_services/rest/dashboard.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { PropertiesService } from 'src/_services/rest/properties.service';
import { UserService } from 'src/_services/rest/user.service';
import { PaginationService } from 'src/_services/pagination.service';
import { Pagination } from 'src/_models/pagination';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  baseurl = environment.baseurl;
  form: FormGroup;
  userInfo: User;
  selectLease: lookupdata[] = [];
  selectAuctions: lookupdata[] = [];
  data: any = [];
  routeSub: Subscription;
  params: Params;
  pager: Pagination;
  count: number = 0;
  start: number = 1;
  end: number = 25;
  search: any;
  constructor(
    private formBuilder: FormBuilder,
    private _propertiesService: PropertiesService,
    private _userService: UserService,
    private _lookupService: LookUpService,
    private _authService: AuthService,
    private ps: PermissionService,
    private router: Router,
    private route: ActivatedRoute,
    private pagination: PaginationService
  ) {
    this.form = this.formBuilder.group({
      lease: [''],
      auctions: [''],
      search: [''],
    });
    this.selectLease = [{ name: 'Test', value: '1' }];
    this.selectAuctions = [{ name: 'Test', value: '1' }];
    this.routeSub = this.route.queryParams.subscribe((queryParams) => {
      this.params = queryParams;
      if (Object.keys(this.params).length > 0) {
        this.getProperty(this.params);
      }
    });
  }

  ngOnInit(): void {
    this.getProperty();
  }

  getProperty(paramss = null) {
    const params = { ...paramss, ...this.params };
    const sub = this._propertiesService.getProperty(params).subscribe({
      next: (res) => {
        this.data = res['data'];
        this.pager = this.pagination.compile(Object.assign({}, this.params, { count: res['pagination'].total }));
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  searchProperties(params) {
    this.data = [];
    this.start - 1;
    this.end = 25;
    this.getProperty({ startCount: this.start, endCount: this.end, ...params });
  }

  getPrevious() {
    this.start = this.start - 25;
    this.end = this.end - 25;
    this.getProperty({
      query: this.form.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }

  getNext() {
    this.start = this.end + 1;
    this.end = this.end + 25;
    this.getProperty({
      query: this.form.value.search,
      startCount: this.start,
      endCount: this.end,
    });
  }
}
