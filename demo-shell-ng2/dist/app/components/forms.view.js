System.register(['angular2/core', "./form-design-surface.component"], function(exports_1, context_1) {
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
    var core_1, form_design_surface_component_1;
    var FormsView;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (form_design_surface_component_1_1) {
                form_design_surface_component_1 = form_design_surface_component_1_1;
            }],
        execute: function() {
            FormsView = (function () {
                function FormsView() {
                }
                FormsView = __decorate([
                    core_1.Component({
                        selector: 'forms-view',
                        template: "\n        <div class=\"container\" style=\"width:970px;\">\n            <div class=\"row\">\n                <div class=\"col-md-12\">\n                    <!-- Design surface -->\n                    <form-design-surface></form-design-surface>\n                </div>\n            </div>\n        </div>\n    ",
                        directives: [form_design_surface_component_1.FormDesignSurface]
                    }), 
                    __metadata('design:paramtypes', [])
                ], FormsView);
                return FormsView;
            }());
            exports_1("FormsView", FormsView);
        }
    }
});
//# sourceMappingURL=forms.view.js.map