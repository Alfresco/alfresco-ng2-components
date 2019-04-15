import { Component, EventEmitter, Output } from '@angular/core';
import { Tab } from './tab.interface';

@Component({
  selector: 'shared-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
  tabs: Tab[] = [];

  @Output() selected = new EventEmitter();

  addTab(tabComponent: Tab) {
    if (!this.tabs.length) {
      tabComponent.hidden = false;
    }
    this.tabs.push(tabComponent);
  }

  selectTab(tabComponent: Tab) {
    this.tabs.map(tab => (tab.hidden = true));
    tabComponent.hidden = false;
    this.selected.emit(tabComponent);
  }
}
