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

import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SearchProperties } from './search-properties';
import { FileSizeOperator } from './file-size-operator.enum';
import { FileSizeUnit } from './file-size-unit.enum';
import { SearchWidget } from '@alfresco/adf-content-services';
import { Subject } from 'rxjs';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';

@Component({
    selector: 'adf-search-properties',
    templateUrl: './search-properties.component.html',
    styleUrls: ['./search-properties.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchPropertiesComponent implements OnInit, AfterViewChecked, SearchWidget {
    private _form = this.formBuilder.group<SearchProperties>({
        fileSizeOperator: FileSizeOperator.AT_LEAST,
        fileSize: undefined,
        fileSizeUnit: FileSizeUnit.KB
    });
    private _fileSizeOperators = Object.keys(FileSizeOperator).map<string>(key => FileSizeOperator[key]);
    private _fileSizeUnits = [FileSizeUnit.KB, FileSizeUnit.MB, FileSizeUnit.GB];
    private canvas = document.createElement('canvas');
    private _fileSizeOperatorsMaxWidth: number;
    private selectedExtensions: string[];

    @ViewChild('fileSizeOperatorSelect', {read: ElementRef})
    fileSizeOperatorSelectElement: ElementRef;

    get form(): SearchPropertiesComponent['_form'] {
        return this._form;
    }

    get fileSizeOperators(): string[] {
        return this._fileSizeOperators;
    }

    get fileSizeUnits(): FileSizeUnit[] {
        return this._fileSizeUnits;
    }

    get fileSizeOperatorsMaxWidth(): number {
        return this._fileSizeOperatorsMaxWidth;
    }

    constructor(private formBuilder: FormBuilder) {
    }

    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    isActive?: boolean;
    startValue: any;
    displayValue$ = new Subject<string>();

    ngOnInit() {
        this.displayValue$.next('asdasd');
    }

    ngAfterViewChecked() {
        if (this.fileSizeOperatorSelectElement?.nativeElement.clientWidth && !this._fileSizeOperatorsMaxWidth) {
            setTimeout(() => {
                const extraFreeSpace = 20;
                this._fileSizeOperatorsMaxWidth = Math.max(...this._fileSizeOperators.map((operator) =>
                    this.getOperatorNameWidth(operator, this.getCanvasFont(this.fileSizeOperatorSelectElement.nativeElement)))) +
                    this.fileSizeOperatorSelectElement.nativeElement.querySelector('.mat-select-arrow-wrapper').clientWidth +
                    extraFreeSpace;
            });
        }
    }

    reset(): void {
        throw new Error('Method not implemented.');
    }

    submitValues(): void {
        let query = '';
        this.displayValue$.next(`${this.form.value.fileSizeOperator} ${this.form.value.fileSize} ${this.form.value.fileSizeUnit.abbreviation}`);
        const size = this.form.value.fileSize * this.form.value.fileSizeUnit.bytes;
        console.log(size);
        /*switch(this.form.value.fileSizeOperator) {
            case FileSizeOperator.AT_MOST:
                query = `content.size:[0 TO ${size}]`;
                break;
            case FileSizeOperator.AT_LEAST:
                query = `content.size:[${size} TO MAX]`;
                break;
            default:
                query = `content.size:[${size} TO ${size}]`;
        }*/
        if (this.selectedExtensions) {
            if (query) {
                query += ' AND ';
            }
            query += `content.mimetype:("${this.selectedExtensions.join('" AND "')}")`;

        }
        this.context.queryFragments[this.id] = query;
        this.context.update();
    }

    hasValidValue(): boolean {
        throw new Error('Method not implemented.');
    }

    getCurrentValue() {
        throw new Error('Method not implemented.');
    }

    setValue(value: any) {
        console.log(value);
        throw new Error('Method not implemented.');
    }

    setSelectedFileExtensions(extensions: string[]) {
        this.selectedExtensions = extensions;
    }

    private getOperatorNameWidth(operator: string, font: string): number {
        const context = this.canvas.getContext('2d');
        context.font = font;
        return context.measureText(operator).width;
    }

    private getCssStyle(element: HTMLElement, property: string): string {
        return window.getComputedStyle(element, null).getPropertyValue(property);
    }

    private getCanvasFont(el: HTMLElement): string {
        return `${this.getCssStyle(el, 'font-weight')} ${this.getCssStyle(el, 'font-size')} ${this.getCssStyle(el, 'font-family')}`;
    }
}
