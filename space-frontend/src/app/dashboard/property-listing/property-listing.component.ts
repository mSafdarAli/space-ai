import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/_services/rest/dashboard.service';

@Component({
  selector: 'app-property-listing',
  templateUrl: './property-listing.component.html',
  styleUrls: ['./property-listing.component.scss'],
})
export class PropertyListingComponent implements OnInit {
  step = 0;
  panelOpenState = false;
  data: any = [];
  routeSub: Subscription;
  id: string = '';
  constructor(
    private _dashboardService: DashboardService,
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
      const sub = this._dashboardService.getPropertybyid(this.id).subscribe({
        next: (res) => {
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  }

  // onSubmit() {
  //   if (this.form.valid) {
  //     const data = Object.assign({}, this.form.value);
  //     if (this.ProductID) {
  //       data.id = this.ProductID;
  //     }
  //     const sub = this.productService
  //       .createOrUpdateProducts(data)
  //       .subscribe({
  //         next: (res) => {
  //           this.toaster.success(
  //             `Product ${this.ProductID ? 'Updated' : 'Created'} Successfully`,
  //             'Success'
  //           );
  //           this.dialogRef.close();
  //           sub.unsubscribe();
  //         },
  //         error: (res) => {
  //           sub.unsubscribe();
  //         },
  //       });
  //   }
  // }
}
