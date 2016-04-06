import {Component, Input, ElementRef} from "angular2/core";

@Component({
    selector: 'side-menu',
    host: {
        '(click)': 'onClick($event)',
        //'(document:click)': 'onOutsideClick($event)'
    },
    template: `
        <nav class="cbp-spmenu cbp-spmenu-vertical cbp-spmenu-{{direction}} inline-menu" 
            [ngClass]="{ 'cbp-spmenu-open': isOpen }">
            <h3>
                {{title}}
                <a href="#" class="menu-close pull-right" (click)="close()">
                    <i class="glyphicon glyphicon-remove"></i>
                </a>
            </h3>
            <ng-content></ng-content>
        </nav>
    `
})
export class SideMenu {
    @Input() title: string = '';
    @Input() direction: string = 'left';
    isOpen: boolean = false;

    constructor(private el: ElementRef) {

    }

    onClick(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    toggle() {
        this.isOpen = !this.isOpen;
    }

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }
}
