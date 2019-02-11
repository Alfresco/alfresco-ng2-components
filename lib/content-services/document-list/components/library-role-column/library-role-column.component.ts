/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'adf-library-role-column',
  template: `
    <span title="{{ displayText | translate }}">
      {{ displayText | translate }}
    </span>
  `,
  host: { class: 'adf-library-role-column' }
})
export class LibraryRoleColumnComponent implements OnInit {
  @Input()
  context: any;

  displayText: string;

  ngOnInit() {
    const node = this.context.row.node;
    if (node && node.entry) {
      const role: string = node.entry.role;
      switch (role) {
        case 'SiteManager':
          this.displayText = 'LIBRARY.ROLE.MANAGER';
          break;
        case 'SiteCollaborator':
          this.displayText = 'LIBRARY.ROLE.COLLABORATOR';
          break;
        case 'SiteContributor':
          this.displayText = 'LIBRARY.ROLE.CONTRIBUTOR';
          break;
        case 'SiteConsumer':
          this.displayText = 'LIBRARY.ROLE.CONSUMER';
          break;
        default:
          this.displayText = '';
          break;
      }
    }
  }
}
