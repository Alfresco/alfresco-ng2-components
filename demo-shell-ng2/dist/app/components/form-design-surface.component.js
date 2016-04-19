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
    var FormDesignSurface;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            FormDesignSurface = (function () {
                function FormDesignSurface(elementRef) {
                    this.elementRef = elementRef;
                    //el.nativeElement.style.backgroundColor = 'yellow';
                }
                Object.defineProperty(FormDesignSurface.prototype, "selectedWidget", {
                    get: function () {
                        return this._selectedWidget;
                    },
                    set: function (val) {
                        if (this.selectedWidget && this.selectedWidget != val) {
                            this._selectedWidget.classList.remove('selected');
                        }
                        this._selectedWidget = val;
                        if (this._selectedWidget) {
                            this._selectedWidget.classList.add('selected');
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                FormDesignSurface.prototype.ngOnInit = function () {
                    // Create root container
                    var container = widgets.container.create();
                    container.dataset.widgetType = 'container';
                    this.setupWidget(container);
                    this.elementRef.nativeElement.appendChild(container);
                };
                FormDesignSurface.prototype.setupWidget = function (widget) {
                    // initialize all drop placeholders
                    var dropPlaceholders = widget.querySelectorAll('.drop-zone');
                    for (var i = 0; i < dropPlaceholders.length; i++) {
                        var placeholder = dropPlaceholders[i];
                        var z = new dropZone({
                            element: placeholder,
                            onDrop: this.onWidgetDrop.bind(this)
                        });
                    }
                    // initialize clicks
                    if (widget.dataset['widgetId']) {
                        widget.addEventListener('mouseup', this.onWidgetMouseUp.bind(this), false);
                    }
                    // wire child element clicks
                    var nested = widget.querySelectorAll('[data-widget-id]');
                    for (var x = 0; x < nested.length; x++) {
                        nested[x].addEventListener('mouseup', this.onWidgetMouseUp.bind(this), false);
                    }
                };
                FormDesignSurface.prototype.onWidgetMouseUp = function (e) {
                    var wid = e.currentTarget.dataset.widgetId;
                    if (wid) {
                        console.log('Selected Widget Id: ' + wid);
                        this.selectedWidget = e.currentTarget;
                        e.stopPropagation();
                    }
                };
                FormDesignSurface.prototype.onWidgetDrop = function (dz, opts) {
                    var widgetType = opts.widgetType;
                    if (widgetType) {
                        var component = widgets[widgetType];
                        if (component) {
                            var widget = component.create();
                            if (widget) {
                                widget.dataset.widgetType = widgetType;
                                this.setupWidget(widget);
                                // insert widget before drop zone
                                var container = dz.parentElement;
                                container.insertBefore(widget, dz);
                                // create new drop zone
                                var zone = new dropZone({
                                    onDrop: this.onWidgetDrop.bind(this),
                                    minHeight: '5px'
                                });
                                // insert new drop zone before widget
                                container.insertBefore(zone.element, widget);
                            }
                        }
                    }
                };
                FormDesignSurface = __decorate([
                    core_1.Component({
                        selector: 'form-design-surface',
                        template: '<div></div>'
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], FormDesignSurface);
                return FormDesignSurface;
            }());
            exports_1("FormDesignSurface", FormDesignSurface);
        }
    }
});
//# sourceMappingURL=form-design-surface.component.js.map