System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var AlfrescoSettingsService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            AlfrescoSettingsService = (function () {
                function AlfrescoSettingsService() {
                    this._host = 'http://127.0.0.1:8080';
                }
                Object.defineProperty(AlfrescoSettingsService.prototype, "host", {
                    get: function () {
                        return this._host;
                    },
                    set: function (value) {
                        this._host = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                AlfrescoSettingsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], AlfrescoSettingsService);
                return AlfrescoSettingsService;
            }());
            exports_1("AlfrescoSettingsService", AlfrescoSettingsService);
        }
    }
});
//# sourceMappingURL=AlfrescoSettingsService.js.map