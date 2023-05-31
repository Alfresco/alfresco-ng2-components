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

import { ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';

@Component({
    selector: 'adf-search-chip-input',
    templateUrl: './search-chip-input.component.html',
    styleUrls: ['./search-chip-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-chip-input' }
})
export class SearchChipInputComponent implements OnInit {
    @Input()
    label: string;

    @Input()
    addOnBlur = true;

    @Input()
    onReset: Observable<void>;

    @Output()
    phrasesChanged: EventEmitter<string[]> = new EventEmitter();

    phrases: string[] = [];
    readonly separatorKeysCodes = [ENTER] as const;

    ngOnInit() {
        this.onReset.subscribe(() => this.resetChips());
    }

    addPhrase(event: MatChipInputEvent) {
        const phrase = (event.value || '').trim();

        if (phrase) {
          this.phrases.push(phrase);
          this.phrasesChanged.emit(this.phrases);
        }
        event.chipInput.clear();
    }

    removePhrase(phrase: string) {
        const index = this.phrases.indexOf(phrase);
        if (index >= 0) {
            this.phrases.splice(index, 1);
            this.phrasesChanged.emit(this.phrases);
        }
    }

    private resetChips() {
        this.phrases = [];
        this.phrasesChanged.emit(this.phrases);
    }
}
