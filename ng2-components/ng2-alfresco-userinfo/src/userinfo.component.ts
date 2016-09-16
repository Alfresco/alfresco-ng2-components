
import { Component } from '@angular/core';
import { ECMUserService } from './services/ecmUser.service';
import { EcmUserModel } from './models/ecmUser.model';

@Component({
    selector: 'ng2-alfresco-userinfo',
    styles: [`:host h1 { font-size:22px }`],
    template: `<h1>Hello World Angular 2 ng2-alfresco-userinfo</h1> <button (click)='doQueryUser()'>Do Query</button>`,
    providers: [ ECMUserService ]
})


export class UserInfoComponent {

    private  ecmUser: EcmUserModel;

    constructor(private ecmUserService: ECMUserService) {
      console.log('User info component constr');
    }

    doQueryUser() {
      this.ecmUserService.getUserInfo('admin')
                           .subscribe(
                                    res => this.ecmUser = <EcmUserModel> res.entry
                           );
    }



}
