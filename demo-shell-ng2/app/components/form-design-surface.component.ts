import {Component, ElementRef, OnInit} from "angular2/core";

declare var dropZone: any;
declare var widgets: any;

@Component({
    selector: 'form-design-surface',
    template: '<div></div>'
})
export class FormDesignSurface implements OnInit {

    private _selectedWidget: Element;

    constructor(public elementRef: ElementRef) {
        //el.nativeElement.style.backgroundColor = 'yellow';
    }

    get selectedWidget(): Element {
        return this._selectedWidget;
    }

    set selectedWidget(val: Element) {
        if (this.selectedWidget && this.selectedWidget != val) {
            this._selectedWidget.classList.remove('selected');
        }
        this._selectedWidget = val;
        if (this._selectedWidget) {
            this._selectedWidget.classList.add('selected');
        }
    }

    ngOnInit() {
        // Create root container
        var container = widgets.container.create();
        container.dataset.widgetType = 'container';
        this.setupWidget(container);
        this.elementRef.nativeElement.appendChild(container);
    }

    private setupWidget(widget: HTMLElement) {
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
    }

    private onWidgetMouseUp(e) {
        var wid = e.currentTarget.dataset.widgetId;
        if (wid) {
            console.log('Selected Widget Id: ' + wid);
            this.selectedWidget = e.currentTarget;
            e.stopPropagation();
        }
    }

    private onWidgetDrop(dz, opts) {
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
    }
}
