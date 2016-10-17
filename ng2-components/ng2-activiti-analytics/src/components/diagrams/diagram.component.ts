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

import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
    moduleId: module.id,
    selector: 'diagram',
    templateUrl: './diagram.component.html',
    styleUrls: ['./diagram.component.css']
})
export class DiagramComponent {

    @Input()
    modelType: string;

    @Input()
    processDefinitionId: string;

    @Output()
    onError = new EventEmitter();

    private diagram: any;
    private element: ElementRef;

    constructor(elementRef: ElementRef,
                private translate: AlfrescoTranslationService,
                private analyticsService: AnalyticsService) {
        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-analytics/src');
        }
        this.element = elementRef;
    }

    ngOnInit() {
        this.getProcessDefinitionModel(this.processDefinitionId);
    }

    getProcessDefinitionModel(processDefinitionId: string) {
        if (this.modelType === 'process-definition') {
            this.analyticsService.getProcessDefinitionModel(processDefinitionId).subscribe(
                (res: any) => {
                    this.diagram = res;
                    console.log(res);
                },
                (err: any) => {
                    this.onError.emit(err);
                    console.log(err);
                }
            );
        }
    }
}
