import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PropertiesService } from 'src/_services/rest/properties.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  step = 0;
  website: string;
  panelOpenState = false;
  data: any = [];
  routeSub: Subscription;
  id: string = '';
  images:any[];
  constructor(
    private _propertiesService: PropertiesService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService
  ) {}

  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }

  // getPropertybyid(id: string) {
  //   const sub = this._dashboardService.getPropertybyid(id).subscribe({
  //     error: (res) => {
  //       sub.unsubscribe();
  //     },
  //   });
  // }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.id = params['id'];
      console.log(this.id);
    });

    if (this.id) {
      const sub = this._propertiesService.getPropertybyid(this.id).subscribe({
        next: (res) => {
          this.website = res['data']['website'];
          this.data = res['data']['details'];
          this.images=res['data']['details'].images;
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  }
}
