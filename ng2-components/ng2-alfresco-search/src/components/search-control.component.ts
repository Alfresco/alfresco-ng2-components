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

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { AlfrescoAuthenticationService, ThumbnailService } from 'ng2-alfresco-core';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'adf-search-control',
    templateUrl: './search-control.component.html',
    styleUrls: ['./search-control.component.scss'],
    animations: [
        trigger('transitionMessages', [
            state('active', style({transform: 'translateX(0%)'})),
            state('inactive', style({transform: 'translateX(83%)', overflow: 'hidden'})),
            state('no-animation', style({transform: 'translateX(0%)', width: '100%'})),
            transition('inactive => active',
                animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)')),
            transition('active => inactive',
                animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'))
        ])
    ]
})
export class SearchControlComponent implements OnInit {

    @Input()
    expandable: boolean = true;

    @Input()
    highlight: boolean = false;

    @Input()
    inputType: string = 'text';

    @Input()
    autocomplete: boolean = false;

    @Input()
    liveSearchEnabled: boolean = true;

    @Output()
    submit: EventEmitter<any> = new EventEmitter();

    @Output()
    searchChange: EventEmitter<string> = new EventEmitter();

    @Output()
    optionClicked: EventEmitter<any> = new EventEmitter();

    fileNodeId: string;
    fileShowed: boolean = false;
    searchTerm: string = '';
    subscriptAnimationState: string;

    private toggleSearch = new Subject<any>();

    constructor(public authService: AlfrescoAuthenticationService,
                private thumbnailService: ThumbnailService) {

                this.toggleSearch.asObservable().debounceTime(100).subscribe(() => {
                  if (this.expandable) {
                      this.subscriptAnimationState = this.subscriptAnimationState === 'inactive' ? 'active' : 'inactive';

                      if (this.subscriptAnimationState === 'inactive') {
                          this.searchTerm = '';
                      }
                  }
              });
    }

    ngOnInit() {
        this.subscriptAnimationState = this.expandable ? 'inactive' : 'no-animation';
    }

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    searchSubmit(event: any) {
        this.submit.emit(event);
        this.toggleSearchBar();
    }

    inputChange(event: any) {
        this.searchChange.emit(event);
    }

    getAutoComplete(): string {
        return this.autocomplete ? 'on' : 'off';
    }

    getMimeTypeIcon(node: MinimalNodeEntity): string {
      let mimeType;

      if (node.entry.content && node.entry.content.mimeType) {
          mimeType = node.entry.content.mimeType;
      }
      if (node.entry.isFolder) {
          mimeType = 'folder';
      }

      return this.thumbnailService.getMimeTypeIcon(mimeType);
  }

  isSearchBarActive() {
      return this.subscriptAnimationState === 'active' && this.liveSearchEnabled;
  }

  toggleSearchBar() {
    this.toggleSearch.next();
  }

  elementClicked(item: any) {
      if (item.entry) {
          this.optionClicked.next(item);
          this.toggleSearchBar();
      }
  }

  panelClosed(event: any) {
      this.toggleSearchBar();
  }

  closeSearchWhenNoPanel(event: any) {
    this.toggleSearchBar();
  }

}
