/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef
} from '@angular/core';
import { NodeEntry } from '@alfresco/js-api';

@Component({
  selector: 'adf-name-column',
  template: `
    <span title="{{ node | adfNodeNameTooltip }}" (click)="onClick()">
      {{ displayText }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'adf-datatable-cell adf-datatable-link adf-name-column' }
})
export class NameColumnComponent implements OnInit {
  @Input()
  context: any;

  displayText: string;
  node: NodeEntry;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.node = this.context.row.node;
    if (this.node && this.node.entry) {
      this.displayText = this.node.entry.name || this.node.entry.id;
    }
  }

  onClick() {
    this.element.nativeElement.dispatchEvent(
      new CustomEvent('name-click', {
        bubbles: true,
        detail: {
          node: this.node
        }
      })
    );
  }
}
