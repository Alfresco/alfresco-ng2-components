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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { DiagramElementModel, DiagramModel } from '../models/diagram.model';
import { DiagramColorService } from '../services/diagram-color.service';
import { DiagramsService } from '../services/diagrams.service';
import { RaphaelService } from './raphael/raphael.service';

@Component({
    selector: 'adf-diagram, activiti-diagram',
    styleUrls: ['./diagram.component.css'],
    templateUrl: './diagram.component.html'
})
export class DiagramComponent implements OnChanges {
    @Input()
    processDefinitionId: any;

    @Input()
    processInstanceId: any;

    @Input()
    metricPercentages: any;

    @Input()
    metricColor: any;

    @Input()
    metricType: string = '';

    @Input()
    width: number = 1000;

    @Input()
    height: number = 500;

    @Output()
    onSuccess = new EventEmitter();

    @Output()
    onError = new EventEmitter();

    PADDING_WIDTH: number = 60;
    PADDING_HEIGHT: number = 60;

    diagram: DiagramModel;

    constructor(translateService: AlfrescoTranslationService,
                private diagramColorService: DiagramColorService,
                private raphaelService: RaphaelService,
                private diagramsService: DiagramsService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-diagrams', 'assets/ng2-activiti-diagrams');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.reset();
        this.diagramColorService.setTotalColors(this.metricColor);
        if (this.processDefinitionId) {
            this.getProcessDefinitionModel(this.processDefinitionId);
        } else {
            this.getRunningProcessDefinitionModel(this.processInstanceId);
        }
    }

    getRunningProcessDefinitionModel(processInstanceId: string) {
        this.diagramsService.getRunningProcessDefinitionModel(processInstanceId).subscribe(
            (res: any) => {
                this.diagram = new DiagramModel(res);
                this.raphaelService.setting(this.diagram.diagramWidth + this.PADDING_WIDTH,
                                            this.diagram.diagramHeight + this.PADDING_HEIGHT);
                this.setMetricValueToDiagramElement(this.diagram, this.metricPercentages, this.metricType);
                this.onSuccess.emit(res);
            },
            (err: any) => {
                this.onError.emit(err);
            }
        );
    }

    getProcessDefinitionModel(processDefinitionId: string) {
        this.diagramsService.getProcessDefinitionModel(processDefinitionId).subscribe(
            (res: any) => {
                this.diagram = new DiagramModel(res);
                this.raphaelService.setting(this.diagram.diagramWidth + this.PADDING_WIDTH,
                                            this.diagram.diagramHeight + this.PADDING_HEIGHT);
                this.setMetricValueToDiagramElement(this.diagram, this.metricPercentages, this.metricType);
                this.onSuccess.emit(res);
            },
            (err: any) => {
                this.onError.emit(err);
            }
        );
    }

    setMetricValueToDiagramElement(diagram: DiagramModel, metrics: any, metricType: string) {
        for (let key in metrics) {
            if (metrics.hasOwnProperty(key)) {
                let foundElement: DiagramElementModel = diagram.elements.find(
                    (element: DiagramElementModel) => element.id === key);
                if (foundElement) {
                    foundElement.value = metrics[key];
                    foundElement.dataType = metricType;
                }
            }
        }
    }

    reset() {
        this.raphaelService.reset();
    }
}
