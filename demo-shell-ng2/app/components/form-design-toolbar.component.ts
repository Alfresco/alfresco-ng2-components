import {Component, OnInit} from "angular2/core";
import {FormService} from "../services/form-service";

@Component({
    selector: 'form-design-toolbar',
    providers: [FormService],
    //encapsulation: ViewEncapsulation.Native,
    styles: [`
        .category-header {
            color: #555;
            padding: 11px;
            margin: 0;
            background: #e7e7e7;
            cursor: default;
            font-size: 14px;
            font-weight: bold;
        }
        
        a.toolbar-item {
            cursor: move;
            
            display: block;
            color: #777;
            font-size: 1.1em;
            font-weight: 300;
            text-decoration: none;
            
            border-bottom: 1px solid #e7e7e7;
            padding: 1em;
        }
        
        a.toolbar-item:hover {
            color: #555;
            background: #f8f8f8;
        }
        
        a.toolbar-item:active, a.toolbar-item.active {
            color: #fff;
            border-color: #428bca;
            background-color: #428bca;
        }
    `],
    template: `
        <template ngFor #category [ngForOf]="categories">
           <h3 class="category-header">{{category.name}}</h3>
            <a *ngFor="#widget of category.widgets" class="toolbar-item" attr.data-widget-type="{{widget.type}}" draggable="true"
                (dragstart)="onElementDragStart($event)" (dragend)="onElementDragEnd($event)">
                <i class="{{widget.iconClass || 'fa fa-puzzle-piece'}}"></i> {{widget.name}}
            </a>
        </template>
    `
})
export class FormDesignToolbar implements OnInit {

    categories: any[];
    private dragCache;

    constructor(
        private _formService: FormService
    ) {}

    ngOnInit() {
        this.categories = this._formService.getWidgetCategories();
        // Stores drag ghost elements
        this.dragCache = document.getElementById('drag-images-cache');
    }

    onElementDragStart(e) {
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
    }

    onElementDragEnd(e) {
        if (this.dragCache) {
            this.dragCache.innerHTML = '';
        }
    }

}
