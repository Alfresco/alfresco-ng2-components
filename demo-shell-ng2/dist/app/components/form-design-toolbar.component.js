System.register(["angular2/core", "../services/form-service"], function(exports_1, context_1) {
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
    var core_1, form_service_1;
    var FormDesignToolbar;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (form_service_1_1) {
                form_service_1 = form_service_1_1;
            }],
        execute: function() {
            FormDesignToolbar = (function () {
                function FormDesignToolbar(_formService) {
                    this._formService = _formService;
                }
                FormDesignToolbar.prototype.ngOnInit = function () {
                    this.categories = this._formService.getWidgetCategories();
                    // Stores drag ghost elements
                    this.dragCache = document.getElementById('drag-images-cache');
                };
                FormDesignToolbar.prototype.onElementDragStart = function (e) {
                    e.dataTransfer.effectAllowed = 'move';
                    var widgetType = e.target.dataset.widgetType;
                    var payload = { "widgetType": widgetType };
                    e.dataTransfer.setData('text', JSON.stringify(payload));
                    //var dragImage = getDragImage(widgetType);
                    var dragImage = this._formService.getDragImage(widgetType);
                    this.dragCache.appendChild(dragImage);
                    //e.dataTransfer.setDragImage(dragImage, dragImage.offsetWidth / 2, 0);
                    e.dataTransfer.setDragImage(dragImage, 0, 0);
                    e.stopPropagation();
                };
                FormDesignToolbar.prototype.onElementDragEnd = function (e) {
                    if (this.dragCache) {
                        this.dragCache.innerHTML = '';
                    }
                };
                FormDesignToolbar = __decorate([
                    core_1.Component({
                        selector: 'form-design-toolbar',
                        providers: [form_service_1.FormService],
                        //encapsulation: ViewEncapsulation.Native,
                        styles: ["\n        .category-header {\n            color: #555;\n            padding: 11px;\n            margin: 0;\n            background: #e7e7e7;\n            cursor: default;\n            font-size: 14px;\n            font-weight: bold;\n        }\n        \n        a.toolbar-item {\n            cursor: move;\n            \n            display: block;\n            color: #777;\n            font-size: 1.1em;\n            font-weight: 300;\n            text-decoration: none;\n            \n            border-bottom: 1px solid #e7e7e7;\n            padding: 1em;\n        }\n        \n        a.toolbar-item:hover {\n            color: #555;\n            background: #f8f8f8;\n        }\n        \n        a.toolbar-item:active, a.toolbar-item.active {\n            color: #fff;\n            border-color: #428bca;\n            background-color: #428bca;\n        }\n    "],
                        template: "\n        <template ngFor #category [ngForOf]=\"categories\">\n           <h3 class=\"category-header\">{{category.name}}</h3>\n            <a *ngFor=\"#widget of category.widgets\" class=\"toolbar-item\" attr.data-widget-type=\"{{widget.type}}\" draggable=\"true\"\n                (dragstart)=\"onElementDragStart($event)\" (dragend)=\"onElementDragEnd($event)\">\n                <i class=\"{{widget.iconClass || 'fa fa-puzzle-piece'}}\"></i> {{widget.name}}\n            </a>\n        </template>\n    "
                    }), 
                    __metadata('design:paramtypes', [form_service_1.FormService])
                ], FormDesignToolbar);
                return FormDesignToolbar;
            }());
            exports_1("FormDesignToolbar", FormDesignToolbar);
        }
    }
});
//# sourceMappingURL=form-design-toolbar.component.js.map