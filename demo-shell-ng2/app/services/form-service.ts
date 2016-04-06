import {Injectable} from 'angular2/core';

// TODO: move to some namespace
declare var widgets: any;

@Injectable()
export class FormService {
    getWidgetCategories() {
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
                //result.push(category);
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
    }

    getDragImage(widgetType: string): Element {
        var w = widgets[widgetType];
        // try getting exported drag image
        if (w && typeof w.getDragImage === 'function') {
            var img =  w.getDragImage();
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
    }
}
