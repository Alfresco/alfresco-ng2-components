import {Component, Input} from 'angular2/core';

@Component({
    selector: 'tabs',
    template: `
        <ul class="nav nav-tabs">
            <li *ngFor="#tab of tabs" (click)="selectTab(tab, $event)" [class.active]="tab.active">
                <a href="#">{{tab.title}}</a>
            </li>
        </ul>
        <ng-content></ng-content>
    `
})
export class Tabs {
    tabs: Tab[] = [];

    selectTab(tab:Tab, $event) {
        this.tabs.forEach(tab => {
            tab.active = false;
        });
        tab.active = true;
        if ($event) {
            $event.preventDefault();
        }
    }

    addTab(tab:Tab) {
        if (this.tabs.length === 0) {
            tab.active = true;
        }
        this.tabs.push(tab);
    }
}


@Component({
    selector: 'tab',
    template: `
        <div [hidden]="!active">
            <ng-content></ng-content>
        </div>
    `
})
export class Tab {
    @Input('tabTitle') title;
    active: Boolean;

    constructor(tabs: Tabs) {
        tabs.addTab(this);
    }
}
