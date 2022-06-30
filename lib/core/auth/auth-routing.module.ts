import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationConfirmationComponent } from './view/authentication-confirmation/authentication-confirmation.component';

const routes: Routes = [
  { path: 'view/authentication-confirmation', component: AuthenticationConfirmationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
