
import { Component, OnInit, Input } from '@angular/core';
import { ECMUserService } from './services/ecmUser.service';
import { BPMUserService } from './services/bpmUser.service';
import { EcmUserModel } from './models/ecmUser.model';
import { BpmUserModel } from './models/bpmUser.model';
import { AlfrescoContentService } from 'ng2-alfresco-core';

declare let __moduleName: string;

@Component({
    selector: 'ng2-alfresco-userinfo',
    moduleId: __moduleName,
    styles: [`:host h1 { font-size:22px }`],
    templateUrl: './userinfo.component.html',
    providers: [ ECMUserService, BPMUserService, AlfrescoContentService ]
})

export class UserInfoComponent implements OnInit {

    @Input()
    userEmail: string;

    private  ecmUser: EcmUserModel;
    private  bpmUser: BpmUserModel;

    constructor(private ecmUserService: ECMUserService,
                private bpmUserService: BPMUserService,
                private contentService: AlfrescoContentService) {
    }

    ngOnInit() {
        this.ecmUserService.getUserInfo(this.userEmail)
                                .subscribe(
                                      res => this.ecmUser = <EcmUserModel> res
                                );
        this.bpmUserService.getCurrentUserInfo()
                                .subscribe(
                                      res => this.bpmUser = <BpmUserModel> res
                                );
    }

    public getDocumentThumbnailUrl(avatarId: string): string {
        return this.contentService.getDocumentThumbnailUrl(document);
    }
}
