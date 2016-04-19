System.register(["angular2/core", "./document-list.component"], function(exports_1, context_1) {
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
    var core_1, document_list_component_1;
    var Page1View;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (document_list_component_1_1) {
                document_list_component_1 = document_list_component_1_1;
            }],
        execute: function() {
            Page1View = (function () {
                function Page1View() {
                }
                Page1View = __decorate([
                    core_1.Component({
                        selector: 'page1-view',
                        template: "\n        <div class=\"container\">\n            <div class=\"row\">\n                <alfresco-document-list></alfresco-document-list>\n            </div>\n        </div>\n    ",
                        directives: [document_list_component_1.DocumentList]
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