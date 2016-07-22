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
    OnInit, AfterViewChecked, OnChanges,
    SimpleChange,
    Input
} from '@angular/core';
import { MATERIAL_DESIGN_DIRECTIVES } from 'ng2-alfresco-core';

import { FormService } from './../services/form.service';
import { FormModel, FormOutcomeModel } from './widgets/widget.model';

import { TabsWidget } from './widgets/tabs/tabs.widget';
import { ContainerWidget } from './widgets/container/container.widget';

declare let __moduleName: string;
declare var componentHandler;

@Component({
    moduleId: __moduleName,
    selector: 'activiti-form',
    templateUrl: './activiti-form.component.html',
    styleUrls: ['./activiti-form.component.css'],
    directives: [MATERIAL_DESIGN_DIRECTIVES, ContainerWidget, TabsWidget],
    providers: [FormService]
})
export class ActivitiForm implements OnInit, AfterViewChecked, OnChanges {

    @Input()
    taskId: string;

    form: FormModel;
    debugMode: boolean = false;

    hasForm(): boolean {
        return this.form ? true : false;
    }

    constructor(private formService: FormService) {}

    ngOnInit() {
        if (this.taskId) {
            this.loadForm(this.taskId);
        }
    }

    ngAfterViewChecked() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        let taskId = changes['taskId'];
        if (taskId && taskId.currentValue) {
            this.loadForm(taskId.currentValue);
        }
    }


    onOutcomeClicked(outcome: FormOutcomeModel, event?: Event) {
        if (outcome) {
            if (outcome.isSystem) {
                if (outcome.id === '$save') {
                    return this.saveTaskForm();
                }

                if (outcome.id === '$complete') {
                    return this.completeTaskForm();
                }

            } else {
                // Note: Activiti is using NAME field rather than ID for outcomes
                if (outcome.name) {
                    return this.completeTaskForm(outcome.name);
                }
            }
        }
    }

    private loadForm(taskId: string) {
        this.formService
            .getTaskForm(taskId)
            .subscribe(
                form => this.form = new FormModel(form),
                err => console.log(err)
            );
    }

    private saveTaskForm() {
        this.formService.saveTaskForm(this.form.taskId, this.form.values).subscribe(
            (response) => {
                console.log(response);
                alert('Saved');
            },
            (err) => window.alert(err)
        );
    }

    private completeTaskForm(outcome?: string) {
        this.formService
            .completeTaskForm(this.form.taskId, this.form.values, outcome)
            .subscribe(
                (response) => {
                    console.log(response);
                    alert('Saved');
                },
                (err) => window.alert(err)
            );
    }

}
