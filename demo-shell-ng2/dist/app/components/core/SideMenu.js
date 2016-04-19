System.register(["angular2/core"], function(exports_1, context_1) {
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
    var SideMenu;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            SideMenu = (function () {
                function SideMenu(el) {
                    this.el = el;
                    this.title = '';
                    this.direction = 'left';
                    this.isOpen = false;
                }
                SideMenu.prototype.onClick = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                };
                SideMenu.prototype.toggle = function () {
                    this.isOpen = !this.isOpen;
                };
                SideMenu.prototype.open = function () {
                    this.isOpen = true;
                };
                SideMenu.prototype.close = function () {
                    this.isOpen = false;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], SideMenu.prototype, "title", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], SideMenu.prototype, "direction", void 0);
                SideMenu = __decorate([
                    core_1.Component({
                        selector: 'side-menu',
                        host: {
                            '(click)': 'onClick($event)',
                        },
                        template: "\n        <nav class=\"cbp-spmenu cbp-spmenu-vertical cbp-spmenu-{{direction}} inline-menu\" \n            [ngClass]=\"{ 'cbp-spmenu-open': isOpen }\">\n            <h3>\n                {{title}}\n                <a href=\"#\" class=\"menu-close pull-right\" (click)=\"close()\">\n                    <i class=\"glyphicon glyphicon-remove\"></i>\n                </a>\n            </h3>\n            <ng-content></ng-content>\n        </nav>\n    "
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], SideMenu);
                return SideMenu;
            }());
            exports_1("SideMenu", SideMenu);
        }
    }
});
//# sourceMappingURL=SideMenu.js.map