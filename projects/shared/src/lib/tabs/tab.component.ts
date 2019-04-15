import { Component, HostBinding, Input } from '@angular/core';
import { Tab } from './tab.interface';
import { TabsComponent } from './tabs.component';

@Component({
  selector: 'shared-tab',
  template: '<ng-content></ng-content>'
})
export class TabComponent implements Tab {
  @Input() title: string;

  @HostBinding('hidden') hidden = true;

  constructor(tabsComponent: TabsComponent) {
    tabsComponent.addTab(this);
  }
}
