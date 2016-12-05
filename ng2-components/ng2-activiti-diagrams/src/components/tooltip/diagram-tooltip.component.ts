import { Component, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'diagram-tooltip',
    templateUrl: './diagram-tooltip.component.html',
    styleUrls: ['./diagram-tooltip-style.css']
})
export class DiagramTooltip {

    @Input()
    data: any;

    getTooltipHeader(data: any) {
        let headerValue = data.name || data.id;
        return data.type + ' ' + headerValue;
    }

    getTooltipMessage(data: any) {
        return (data.value !== undefined && data.value !== null ) ? data.value + ' ' + data.dataType : '';
    }
}
