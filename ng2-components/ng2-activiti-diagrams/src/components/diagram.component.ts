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

import { Component, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { DiagramsService } from '../services/diagrams.service';
import { DiagramColorService } from '../services/diagram-color.service';
import { RaphaelService } from './raphael/raphael.service';

@Component({
    selector: 'activiti-diagram',
    templateUrl: './diagram.component.html'
})
export class DiagramComponent {
    @Input()
    processDefinitionId: any;

    @Input()
    metricPercentages: any;

    @Input()
    width: number = 1000;

    @Input()
    height: number = 500;

    @Output()
    onSuccess = new EventEmitter();

    @Output()
    onError = new EventEmitter();

    private diagram: any;
    private elementRef: ElementRef;

    constructor(elementRef: ElementRef,
                private translate: AlfrescoTranslationService,
                private diagramColorService: DiagramColorService,
                private raphaelService: RaphaelService,
                private diagramsService: DiagramsService) {
        if (translate) {
            translate.addTranslationFolder('ng2-activiti-analytics', 'node_modules/ng2-activiti-analytics/dist/src');
        }
        this.elementRef = elementRef;
    }

    ngOnInit() {
        this.raphaelService.setting(this.width, this.height);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.reset();
        this.diagramColorService.setTotalColors(this.metricPercentages);
        this.getProcessDefinitionModel(this.processDefinitionId);
    }

    getProcessDefinitionModel(processDefinitionId: string) {
        this.diagramsService.getProcessDefinitionModel(processDefinitionId).subscribe(
            (res: any) => {
                this.diagram = res;
                this.onSuccess.emit(res);
            },
            (err: any) => {
                this.onError.emit(err);
                console.log(err);
            }
        );
    }

    reset() {
        this.raphaelService.reset();
    }
}
