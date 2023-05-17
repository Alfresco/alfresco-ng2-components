/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActionMenuModel, CloudLayoutService } from '../services/cloud-layout.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
    selector: 'app-cloud-settings',
    templateUrl: './cloud-settings.component.html',
    styleUrls: ['./cloud-settings.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CloudSettingsComponent implements OnInit, OnDestroy {
    private onDestroy$ = new Subject<boolean>();

    multiselect: boolean;
    actionMenu: boolean;
    contextMenu: boolean;
    actions: ActionMenuModel[] = [];
    selectionMode: string;
    testingMode: boolean;
    taskDetailsRedirection: boolean;
    processDetailsRedirection: boolean;

    selectionModeOptions = [
        { value: '', title: 'None' },
        { value: 'single', title: 'Single' },
        { value: 'multiple', title: 'Multiple' }
    ];

    actionMenuForm = new UntypedFormGroup({
        key: new UntypedFormControl(''),
        title: new UntypedFormControl(''),
        icon: new UntypedFormControl(''),
        visible: new UntypedFormControl(true),
        disabled: new UntypedFormControl(false)
      });

    constructor(private cloudLayoutService: CloudLayoutService) { }

    ngOnInit() {
        this.cloudLayoutService
            .settings$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(settings => this.setCurrentSettings(settings));
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    setCurrentSettings(settings) {
        if (settings) {
            this.multiselect = settings.multiselect;
            this.testingMode = settings.testingMode;
            this.selectionMode = settings.selectionMode;
            this.taskDetailsRedirection = settings.taskDetailsRedirection;
            this.processDetailsRedirection = settings.processDetailsRedirection;
            this.actionMenu = settings.actionMenu;
            this.contextMenu = settings.contextMenu;
            this.actions = settings.actions;
        }
    }

    toggleMultiselect() {
        this.multiselect = !this.multiselect;
        this.setSetting();
    }

    toggleTestingMode() {
        this.testingMode = !this.testingMode;
        this.setSetting();
    }

    toggleTaskDetailsRedirection() {
        this.taskDetailsRedirection = !this.taskDetailsRedirection;
        this.setSetting();
    }

    toggleProcessDetailsRedirection() {
        this.processDetailsRedirection = !this.processDetailsRedirection;
        this.setSetting();
    }

    onSelectionModeChange() {
        this.setSetting();
    }

    toggleActionMenu() {
        this.actionMenu = !this.actionMenu;
        this.setSetting();
    }

    toggleContextMenu() {
        this.contextMenu = !this.contextMenu;
        this.setSetting();
    }

    addAction() {
        this.actions.push(this.actionMenuForm.value);
        this.actionMenuForm.get('key').reset();
        this.actionMenuForm.get('title').reset();
        this.actionMenuForm.get('icon').reset();
        this.setSetting();
    }

    removeAction(removedAction: ActionMenuModel) {
        this.actions = this.actions.filter((action: ActionMenuModel) => action.key !== removedAction.key);
        this.setSetting();
    }

    setSetting() {
        this.cloudLayoutService.setCurrentSettings({
            multiselect: this.multiselect,
            actionMenu: this.actionMenu,
            contextMenu: this.contextMenu,
            actions: this.actions,
            testingMode: this.testingMode,
            selectionMode: this.selectionMode,
            taskDetailsRedirection: this.taskDetailsRedirection,
            processDetailsRedirection: this.processDetailsRedirection
        });
    }
}
