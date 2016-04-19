System.register(['angular2/core', 'ng2-alfresco/components'], function(exports_1, context_1) {
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
    var core_1, components_1;
    var Page2View;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (components_1_1) {
                components_1 = components_1_1;
            }],
        execute: function() {
            Page2View = (function () {
                function Page2View() {
                }
                Page2View = __decorate([
                    core_1.Component({
                        selector: 'page2-view',
                        template: "\n        <div class=\"container\">\n            <div class=\"row\">\n                <h2>Page 2</h2>\n                <hello-world></hello-world>\n            </div>\n        </div>\n    ",
                        directives: [components_1.HelloWorld]
                    }), 
                    __metadata('design:paramtypes', [])
                ], Page2View);
                return Page2View;
            }());
            exports_1("Page2View", Page2View);
        }
    }
});

//# sourceMappingURL=page2.view.js.map
