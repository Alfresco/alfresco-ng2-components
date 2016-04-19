System.register(['angular2/core', 'ng2-uploader/ng2-uploader'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, ng2_uploader_1;
    var Page1View;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (ng2_uploader_1_1) {
                ng2_uploader_1 = ng2_uploader_1_1;
            }],
        execute: function() {
            Page1View = (function () {
                function Page1View() {
                    this.options = {
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
                    this.dropProgress = 0;
                    this.dropResp = [];
                    this.zone = new core_1.NgZone({ enableLongStackTrace: false });
                }
                Page1View.prototype.handleUpload = function (data) {
                    if (data && data.response) {
                        data = JSON.parse(data.response);
                        this.uploadFile = data;
                    }
                };
                Page1View.prototype.handleDropUpload = function (data) {
                    var _this = this;
                    var index = this.dropResp.findIndex(function (x) { return x.id === data.id; });
                    if (index === -1) {
                        this.dropResp.push(data);
                    }
                    else {
                        this.zone.run(function () {
                            _this.dropResp[index] = data;
                        });
                    }
                    var total = 0, uploaded = 0;
                    this.dropResp.forEach(function (resp) {
                        total += resp.progress.total;
                        uploaded += resp.progress.loaded;
                    });
                    this.dropProgress = Math.floor(uploaded / (total / 100));
                };
                Page1View = __decorate([
                    core_1.Component({
                        selector: 'page1-view',
                        styles: [
                            "\n        :host .dropzone {\n            width: 100%;\n            height: 100px;\n            background-color: #f5f5f5;\n            margin-top: 2px;\n            margin-bottom: 2px;\n            box-shadow: inset 0 1px 2px rgba(0,0,0,.1);\n            text-align: center;\n        }\n        "
                        ],
                        template: "\n        <div class=\"container\">\n            <div class=\"row\">\n                <h2>Upload File</h2>\n                <input type=\"file\" \n                       [ng-file-select]=\"options\"\n                       (onUpload)=\"handleUpload($event)\">\n                <div>\n                    Response: {{ uploadFile | json }}\n                </div>\n            </div>\n            <div class=\"row\">\n                <h2>Drag and Drop file demo</h2>\n                <div class=\"col-md-4 col-md-offset-3\">\n                    <div [ng-file-drop]=\"options\" (onUpload)=\"handleDropUpload($event)\" class=\"dropzone\">\n                        Drop file here...\n                    </div>\n                    <div class=\"progress\">\n                        <div class=\"progress-bar\" [style.width]=\"dropProgress + '%'\"></div>\n                        <span class=\"percent\">{{ dropProgress }}%</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ",
                        directives: [ng2_uploader_1.UPLOAD_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [])
                ], Page1View);
                return Page1View;
            }());
            exports_1("Page1View", Page1View);
        }
    }
});

//# sourceMappingURL=page1.view.js.map
