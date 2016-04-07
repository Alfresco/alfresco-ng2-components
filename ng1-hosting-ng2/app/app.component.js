System.register(['angular2/core', "./components/ng2/tabs"], function(exports_1, context_1) {
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
    var core_1, tabs_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (tabs_1_1) {
                tabs_1 = tabs_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                    this.target = 'http://192.168.99.100:8080/alfresco/service/api/upload';
                    this.multi = 'true';
                    this.accept = 'image/*';
                    this.droppable = false;
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n        <h2>Angular 2 components</h2>\n        <tabs>\n            <tab tabTitle=\"Foo\">\n                <file-upload accept=\"{{accept}}\"  droppable=\"{{droppable}}\" target=\"{{target}}\" multi=\"false\"  >Choose File</file-upload>\n            </tab>\n            <tab tabTitle=\"Bar\">\n                Content of tab Bar\n            </tab>\n        </tabs>\n    ",
                        directives: [tabs_1.Tabs, tabs_1.Tab]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map