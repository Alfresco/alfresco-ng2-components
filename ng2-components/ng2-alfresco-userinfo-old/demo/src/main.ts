/*
import { NgModule, Component, OnInit } from '@angular/core';
import { UserInfoComponent } from 'ng2-alfresco-userinfo';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule,
         AlfrescoSettingsService,
         AlfrescoAuthenticationService } from 'ng2-alfresco-core';

@Component({
  selector: 'my-app',
  styles: [`:host h1 { font-size:22px }`],
  template: `<h1>TEST</h1>`
})


class UserInfoDemo implements OnInit {

      public userToLogin: string = 'admin';
      public password: string = 'admin';
      public loginErrorMessage: string;
      public providers: string = 'BPM';
      private authenticated: boolean;
      private token: any;

      constructor(private authService: AlfrescoAuthenticationService,
                  private settingsService: AlfrescoSettingsService) {
      }

      ngOnInit() {
        this.settingsService.setProviders(this.providers);
      }

      attemptLogin() {
          this.loginErrorMessage = '';
          this.login(this.userToLogin, this.password);
      }

      logout() {
          this.authService.logout();
      }

      login(user, password) {
          this.settingsService.setProviders(this.providers);
          this.authService.login(user, password).subscribe(
              token => {
                  console.log(token);
                  this.token = token;
                  this.authenticated = true;
              },
              error => {
                  console.log(error);
                  this.authenticated = false;
                  this.loginErrorMessage = error;
              });
      }

      isLoggedIn(): boolean {
          return this.authService.isLoggedIn();
      }

      toggleECM(checked) {
          if (checked && this.providers === 'BPM') {
              this.providers = 'ALL';
          } else if (checked) {
              this.providers = 'ECM';
          } else {
              this.providers = undefined;
          }
      }

      toggleBPM(checked) {
          if (checked && this.providers === 'ECM') {
              this.providers = 'ALL';
          } else if (checked) {
              this.providers = 'BPM';
          } else {
              this.providers = undefined;
          }
      }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        UserInfoComponent
    ],
    declarations: [ UserInfoComponent ],
    bootstrap:    [ UserInfoComponent ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
*/
