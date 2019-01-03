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

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'adf-library-status-column',
  template: `
    <span title="{{ displayText | translate }}">
      {{ displayText | translate }}
    </span>
  `,
  host: { class: 'adf-library-status-column' }
})
export class LibraryStatusColumnComponent implements OnInit {
  @Input()
  context: any;

  displayText: string;

  ngOnInit() {
    const node = this.context.row.node;
    if (node && node.entry) {
      const visibility: string = node.entry.visibility;

      switch (visibility.toUpperCase()) {
        case 'PUBLIC':
          this.displayText = 'LIBRARY.VISIBILITY.PUBLIC';
          break;
        case 'PRIVATE':
          this.displayText = 'LIBRARY.VISIBILITY.PRIVATE';
          break;
        case 'MODERATED':
          this.displayText = 'LIBRARY.VISIBILITY.MODERATED';
          break;
        default:
          this.displayText = 'UNKNOWN';
          break;
      }
    }
  }
}
