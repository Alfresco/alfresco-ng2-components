import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedComponent } from './shared.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tabs/tab.component';
import { ButtonComponent } from './button/button.component';

const sharedComponents = [
  SharedComponent,
  ButtonComponent,
  TabComponent,
  TabsComponent
];

@NgModule({
  imports: [CommonModule],
  declarations: [...sharedComponents],
  exports: [...sharedComponents]
})
export class SharedModule {}
