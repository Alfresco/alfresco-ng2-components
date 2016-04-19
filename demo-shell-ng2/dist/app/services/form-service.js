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
    var FormService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            FormService = (function () {
                function FormService() {
                }
                FormService.prototype.getWidgetCategories = function () {
                    var result = [];
                    var categories = {};
                    var keys = Object.keys(widgets);
                    keys.forEach(function (key) {
                        var w = widgets[key];
                        var categoryName = w.category || 'Misc';
                        var category = categories[categoryName];
                        if (!category) {
                            category = {
                                name: categoryName,
                                widgets: []
                            };
                            categories[categoryName] = category;
                        }
                        category.widgets.push({
                            type: key,
                            name: w.name,
                            iconClass: w.iconClass
                        });
                    });
                    Object.keys(categories).sort().forEach(function (key) {
                        result.push(categories[key]);
                    });
                    return result;
                };
                FormService.prototype.getDragImage = function (widgetType) {
                    var w = widgets[widgetType];
                    // try getting exported drag image
                    if (w && typeof w.getDragImage === 'function') {
                        var img = w.getDragImage();
                        if (img) {
                            return img;
                        }
                    }
                    // create default drag image
                    var dragImage = document.createElement('button');
                    dragImage.className = 'btn btn-default drag-image';
                    dragImage.textContent = w.name;
                    dragImage.style.minWidth = '100px';
                    return dragImage;
                };
                FormService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], FormService);
                return FormService;
            }());
            exports_1("FormService", FormService);
        }
    }
});
//# sourceMappingURL=form-service.js.map