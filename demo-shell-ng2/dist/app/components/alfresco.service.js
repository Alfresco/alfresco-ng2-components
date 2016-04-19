System.register(['angular2/core', 'angular2/http', 'rxjs/Observable'], function(exports_1, context_1) {
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
    var core_1, http_1, Observable_1;
    var AlfrescoService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            }],
        execute: function() {
            AlfrescoService = (function () {
                function AlfrescoService(http) {
                    this.http = http;
                    this._host = 'http://192.168.99.100:8080';
                    this._baseUrl = this._host + '/alfresco/service/slingshot/doclib/doclist/all/site/';
                }
                AlfrescoService.prototype.getFolder = function (folder) {
                    var headers = new http_1.Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + btoa('admin:admin')
                    });
                    var options = new http_1.RequestOptions({ headers: headers });
                    return this.http
                        .get(this._baseUrl + folder, options)
                        .map(function (res) { return res.json(); })
                        .do(function (data) { return console.log(data); }) // eyeball results in the console
                        .catch(this.handleError);
                };
                AlfrescoService.prototype.handleError = function (error) {
                    // in a real world app, we may send the error to some remote logging infrastructure
                    // instead of just logging it to the console
                    console.error(error);
                    return Observable_1.Observable.throw(error.json().error || 'Server error');
                };
                AlfrescoService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], AlfrescoService);
                return AlfrescoService;
            }());
            exports_1("AlfrescoService", AlfrescoService);
        }
    }
});
//# sourceMappingURL=alfresco.service.js.map