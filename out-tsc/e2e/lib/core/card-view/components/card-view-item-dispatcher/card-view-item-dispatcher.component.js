"use strict";
/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var card_item_types_service_1 = require("../../services/card-item-types.service");
var card_view_content_proxy_directive_1 = require("../../directives/card-view-content-proxy.directive");
var CardViewItemDispatcherComponent = /** @class */ (function () {
    function CardViewItemDispatcherComponent(cardItemTypeService, resolver) {
        var _this = this;
        this.cardItemTypeService = cardItemTypeService;
        this.resolver = resolver;
        this.displayEmpty = true;
        this.displayNoneOption = true;
        this.displayClearAction = true;
        this.loaded = false;
        this.componentReference = null;
        var dynamicLifeCycleMethods = [
            'ngOnInit',
            'ngDoCheck',
            'ngAfterContentInit',
            'ngAfterContentChecked',
            'ngAfterViewInit',
            'ngAfterViewChecked',
            'ngOnDestroy'
        ];
        dynamicLifeCycleMethods.forEach(function (method) {
            _this[method] = _this.proxy.bind(_this, method);
        });
    }
    CardViewItemDispatcherComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (!this.loaded) {
            this.loadComponent();
            this.loaded = true;
        }
        Object.keys(changes)
            .map(function (changeName) { return [changeName, changes[changeName]]; })
            .forEach(function (_a) {
            var inputParamName = _a[0], simpleChange = _a[1];
            _this.componentReference.instance[inputParamName] = simpleChange.currentValue;
        });
        this.proxy('ngOnChanges', changes);
    };
    CardViewItemDispatcherComponent.prototype.loadComponent = function () {
        var factoryClass = this.cardItemTypeService.resolveComponentType(this.property);
        var factory = this.resolver.resolveComponentFactory(factoryClass);
        this.componentReference = this.content.viewContainerRef.createComponent(factory);
        this.componentReference.instance.editable = this.editable;
        this.componentReference.instance.property = this.property;
        this.componentReference.instance.displayEmpty = this.displayEmpty;
        this.componentReference.instance.displayNoneOption = this.displayNoneOption;
        this.componentReference.instance.displayClearAction = this.displayClearAction;
    };
    CardViewItemDispatcherComponent.prototype.proxy = function (methodName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.componentReference.instance[methodName]) {
            this.componentReference.instance[methodName].apply(this.componentReference.instance, args);
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CardViewItemDispatcherComponent.prototype, "property", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CardViewItemDispatcherComponent.prototype, "editable", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CardViewItemDispatcherComponent.prototype, "displayEmpty", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CardViewItemDispatcherComponent.prototype, "displayNoneOption", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CardViewItemDispatcherComponent.prototype, "displayClearAction", void 0);
    __decorate([
        core_1.ViewChild(card_view_content_proxy_directive_1.CardViewContentProxyDirective),
        __metadata("design:type", card_view_content_proxy_directive_1.CardViewContentProxyDirective)
    ], CardViewItemDispatcherComponent.prototype, "content", void 0);
    CardViewItemDispatcherComponent = __decorate([
        core_1.Component({
            selector: 'adf-card-view-item-dispatcher',
            template: '<ng-template adf-card-view-content-proxy></ng-template>'
        }),
        __metadata("design:paramtypes", [card_item_types_service_1.CardItemTypeService,
            core_1.ComponentFactoryResolver])
    ], CardViewItemDispatcherComponent);
    return CardViewItemDispatcherComponent;
}());
exports.CardViewItemDispatcherComponent = CardViewItemDispatcherComponent;
//# sourceMappingURL=card-view-item-dispatcher.component.js.map