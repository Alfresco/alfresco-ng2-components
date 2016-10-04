/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { UserInfoComponentModule } from 'ng2-alfresco-userinfo';
import { CoreModule, MDL } from 'ng2-alfresco-core';

import { AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';

@Component({
    selector: 'alfresco-userinfo-demo',
    template: `<h4> START DEMO USERINFO </h4>
               <div style="border-radius: 8px; position: absolute; background-color:papayawhip; color: cadetblue; left: 320px; top: 30px; z-index: 1;">
                 <p style="width:120px;margin: 20px;">
                 <label for="switch1" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                     <input type="checkbox" id="switch1" class="mdl-switch__input"
                      (click)="toggleECM(ecm.checked)" #ecm>
                     <span class="mdl-switch__label">ECM</span>
                 </label>
                 </p>
                 <p style="width:120px;margin: 20px;">
                     <label for="switch2" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                         <input type="checkbox" id="switch2" class="mdl-switch__input" checked
                          (click)="toggleBPM(bpm.checked)" #bpm>
                         <span class="mdl-switch__label">BPM</span>
                     </label>
                 </p>
               </div>
               <div *ngIf="isLoggedIn()">
                   <ng2-alfresco-userinfo></ng2-alfresco-userinfo>
               </div>
               <p></p>
               <div>
                   <p>
                       <span>Username</span>
                       <input id="user" type="text" [(ngModel)]="userToLogin" value="admin"/>
                   </p>
                   <p>
                       <span>Password</span>
                       <input id="passw" type="password" [(ngModel)]="password" value="admin"/>
                   </p>
               <button type="submit" (click)="attemptLogin()"> Login !</button>
               </div>
               <span>{{loginErrorMessage}}</span>
               <button (click)="logout()">Logout</button>`,
    styles: [
        ':host > .container {padding: 10px}',
        '.p-10 { padding: 10px; }'
    ]
})
class UserInfoDemo implements onInit{

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
        UserInfoComponentModule.forRoot()
    ],
    declarations: [ UserInfoDemo ],
    bootstrap:    [ UserInfoDemo ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
