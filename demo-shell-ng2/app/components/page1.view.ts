import {Component, NgZone} from 'angular2/core';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';

@Component({
    selector: 'page1-view',
    styles: [
        `
        :host .dropzone {
            width: 100%;
            height: 100px;
            background-color: #f5f5f5;
            margin-top: 2px;
            margin-bottom: 2px;
            box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
            text-align: center;
        }
        `
    ],
    template: `
        <div class="container">
            <div class="row">
                <h2>Upload File</h2>
                <input type="file" 
                       [ng-file-select]="options"
                       (onUpload)="handleUpload($event)">
                <div>
                    Response: {{ uploadFile | json }}
                </div>
            </div>
            <div class="row">
                <h2>Drag and Drop file demo</h2>
                <div class="col-md-4 col-md-offset-3">
                    <div [ng-file-drop]="options" (onUpload)="handleDropUpload($event)" class="dropzone">
                        Drop file here...
                    </div>
                    <div class="progress">
                        <div class="progress-bar" [style.width]="dropProgress + '%'"></div>
                        <span class="percent">{{ dropProgress }}%</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    directives: [UPLOAD_DIRECTIVES]
})
export class Page1View {
    uploadFile:any;
    options:Object = {
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

    zone:NgZone;
    dropProgress:number = 0;
    dropResp:any[] = [];

    constructor() {
        this.zone = new NgZone({enableLongStackTrace: false});
    }

    handleUpload(data):void {
        if (data && data.response) {
            data = JSON.parse(data.response);
            this.uploadFile = data;
        }
    }

    handleDropUpload(data):void {
        let index = this.dropResp.findIndex(x => x.id === data.id);
        if (index === -1) {
            this.dropResp.push(data);
        } else {
            this.zone.run(() => {
                this.dropResp[index] = data;
            });
        }

        let total = 0, uploaded = 0;
        this.dropResp.forEach(resp => {
            total += resp.progress.total;
            uploaded += resp.progress.loaded;
        });

        this.dropProgress = Math.floor(uploaded / (total / 100));
    }
}
