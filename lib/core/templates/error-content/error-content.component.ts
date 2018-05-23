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

import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
    selector: 'adf-error-content',
    templateUrl: './error-content.component.html',
    styleUrls: ['./error-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-error-content' }
})
export class ErrorContentComponent implements OnInit {

    errorCode: string;
    errorLinkText: string;
    errorLinkUrl: string;

    constructor(private route: ActivatedRoute,
                private translateService: TranslationService) {
    }

    ngOnInit() {
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['id']) {
                    this.errorCode = params['id'];
                }
            });
        }

        this.getData();
    }

    getData() {
        this.errorLinkText = this.translateService.instant(
            'ERROR_CONTENT.' + this.errorCode + '.LINK.TEXT');

        if (this.errorLinkText) {
            this.errorLinkUrl = this.translateService.instant(
                'ERROR_CONTENT.' + this.errorCode + '.LINK.URL');
        }
    }
}
