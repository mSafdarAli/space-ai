import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/_services/auth.guard';
import { FullWindowComponent } from './full-window/full-window.component';
import { ChangePasswordPopupComponent } from './narrow-window/change-password-popup/change-password-popup.component';
import { NarrowWindowComponent } from './narrow-window/narrow-window.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/dashboard',
  //   pathMatch: 'full',
  // },
  {
    path: '',
    component: FullWindowComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: '',
    component: NarrowWindowComponent,
    children: [
      // {
      //   path: '',
      //   loadChildren: () =>
      //     import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      //     // canActivate: [AuthGuard],
      //     // data: { component: 'property-listing', permission: 'view' }
      // },
      {
        path: 'change-password',
        component: ChangePasswordPopupComponent,
          canActivate: [AuthGuard],
          // data: { component: 'property-listing', permission: 'view' }
      },
      {
        path: 'properties',
        loadChildren: () =>
          import('./properties/properties.module').then((m) => m.PropertiesModule),
          canActivate: [AuthGuard],
          // data: { component: 'property-listing', permission: 'view' }
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
