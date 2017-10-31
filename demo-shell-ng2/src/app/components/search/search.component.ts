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
import { Component, OnInit, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NodePaging } from 'alfresco-js-api';

@Component({
    selector: 'search-component',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    animations: [
    trigger('transitionMessages', [
        state('active', style({transform: 'translateX(0%)'})),
        state('inactive', style({transform: 'translateX(83%)'})),
        state('no-animation', style({transform: 'translateX(0%)', width: '100%'})),
        transition('inactive => active',
            animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)')),
        transition('active => inactive',
            animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'))
    ])
]
})
export class SearchComponent implements OnInit{

    fileNodeId: string;
    queryParamName= 'q';
    searchedWord: string = '';
    fileShowed: boolean = false;
    navigationMode: string = 'dblclick';
    resultNodePageList: NodePaging;

    constructor(public router: Router,
                @Optional() private route: ActivatedRoute) {
    }

    ngOnInit() {
      if (this.route) {
          this.route.params.forEach((params: Params) => {
              this.searchedWord = params.hasOwnProperty(this.queryParamName) ? params[this.queryParamName] : null;
          });
      }
  }

    nodeDbClick($event: any) {
        if ($event.value.entry.isFolder) {
            this.router.navigate(['/files', $event.value.entry.id]);
        } else {
            this.showFile($event);
        }
    }

    showFile($event) {
        if ($event.value.entry.isFile) {
            this.fileNodeId = $event.value.entry.id;
            this.fileShowed = true;
        } else {
            this.fileShowed = false;
        }
    }

    showSearchResult(event: NodePaging) {
      this.resultNodePageList = event;
    }
}
