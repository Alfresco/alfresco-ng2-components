import {Component} from "angular2/core";
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';

@Component({
    selector: 'page1-view',
    template: `
        <div class="container">
            <div class="row">
                <h2>Upload File</h2>
            </div>
            <div class="row">
                <input type="file" 
                       [ng-file-select]="options"
                       (onUpload)="handleUpload($event)">
                <div>
                    Response: {{ uploadFile | json }}
                </div>
            </div>
        </div>
    `,
    directives: [UPLOAD_DIRECTIVES]
})
export class Page1View {
    uploadFile: any;
    options: Object = {
        url: 'http://192.168.99.100:8080/alfresco/service/api/upload',
        withCredentials: true,
        authToken: btoa('admin:admin'),
        authTokenPrefix: 'Basic',
        fieldName: 'filedata',
        formFields: {
            siteid: 'swsdp',
            containerid: 'documentLibrary'
        }
    };

    handleUpload(data): void {
        if (data && data.response) {
            data = JSON.parse(data.response);
            this.uploadFile = data;
        }
    }
}
