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

 /* tslint:disable:component-selector  */

import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { GroupModel } from './../core/group.model';
import { WidgetComponent } from './../widget.component';
import { catchError, debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, merge, of } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'functional-group-widget',
    templateUrl: './functional-group.widget.html',
    styleUrls: ['./functional-group.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class FunctionalGroupWidgetComponent extends WidgetComponent implements OnInit {

    minTermLength: number = 1;
    groupId: string;
    searchTerm = new FormControl();
    initialValue$ = new BehaviorSubject(null);
    groups$ = merge(this.searchTerm.valueChanges, this.initialValue$.asObservable()).pipe(
        tap((group) => this.validateGroup(group)),
        filter((group: string | GroupModel) => typeof group === 'string' && group.length >= this.minTermLength),
        debounceTime(300),
        switchMap((searchTerm: string) => this.formService.getWorkflowGroups(searchTerm, this.groupId)
            .pipe(catchError(() => of([]))))
    );

    constructor(public formService: FormService,
                public elementRef: ElementRef) {
         super(formService);
    }

    ngOnInit() {
        if (this.field) {

            if (this.field.readOnly) {
                this.searchTerm.disable();
            }

            const params = this.field.params;
            if (params && params.restrictWithGroup) {
                const restrictWithGroup = <GroupModel> params.restrictWithGroup;
                this.groupId = restrictWithGroup.id;
            }

            // Load auto-completion for previously saved value
            if (this.field.value?.name) {
                this.searchTerm.setValue(this.field.value.name);
                this.initialValue$.next(this.field.value.name);
            }
        }
    }

   updateOption(option?: GroupModel) {
        if (option) {
            this.field.value = option;
        } else {
            this.field.value = null;
        }

        this.field.updateForm();
    }

    validateGroup(group: GroupModel) {
        const isEmpty = !this.field.required && !group;
        const hasValue = this.field.required && group.name;
        if (isEmpty) {
            this.updateOption();
        }

        if (hasValue || isEmpty) {
            this.field.validate();
            this.field.form.validateForm();
        } else {
            this.field.markAsInvalid();
            this.field.form.markAsInvalid();
        }
    }

    getDisplayName(model: GroupModel | string) {
        if (model) {
            return typeof model === 'string' ? model : model.name;
        }
        return '';
    }
}
