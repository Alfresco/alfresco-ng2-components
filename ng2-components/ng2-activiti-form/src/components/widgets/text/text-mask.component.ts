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
    Directive,
    ElementRef,
    Renderer,
    HostListener,
    Input,
    OnChanges,
    SimpleChanges,
    forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { conformToMask } from 'angular2-text-mask';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MaskedInputDirective),
    multi: true
};

@Directive({
    selector: '[textMask]',
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class MaskedInputDirective implements OnChanges, ControlValueAccessor {

    @Input('textMask') inputMask: string;

    private translationMask = {
        '0': { pattern: /\d/ },
        '9': { pattern: /\d/, optional: true },
        '#': { pattern: /\d/, recursive: true },
        'A': { pattern: /[a-zA-Z0-9]/ },
        'S': { pattern: /[a-zA-Z]/ }
    };

    private letterRegEx = /[a-zA-Z]/;
    private numberRegEx = /\d/;
    private validationRegExp: RegExp;
    private maskArray: string;

    constructor(private el: ElementRef, private render: Renderer) {
    }

    _onChange = (_: any) => {
    }

    _onTouched = () => {
    }

    @HostListener('keyup') onInputTextKeyUp(event: any) {
        console.log('======================================================================');
        console.log('keyup');
        console.log(this.el.nativeElement.value);
        console.log(this.maskArray);
        let mask = this.getMask(this.inputMask, this.el.nativeElement.value);
        this.maskValue(this.el.nativeElement.value, mask);
    }

    @HostListener('input') onInputTextInput(event: any) {
        console.log('input');
        console.log(this.el.nativeElement.value);
        console.log(this.maskArray);
        let mask = this.getMask(this.inputMask, this.el.nativeElement.value);
        this.maskValue(this.el.nativeElement.value, mask);
    }

    @HostListener('change') onInputTextChange(event: any) {
        console.log('CHANGE');
        console.log(this.el.nativeElement.value);
        console.log(this.maskArray);
        let mask = this.getMask(this.inputMask, this.el.nativeElement.value);
        this.maskValue(this.el.nativeElement.value, mask);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['inputMask']) {
            this.validationRegExp = new RegExp(this.getValidationRegExp(changes['inputMask'].currentValue));
            this.maskArray = this.getMaskArray(changes['inputMask'].currentValue);
        }
    }

    writeValue(value: any) {
        this.el.nativeElement.value = value;
    }

    registerOnChange(fn: any) {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => any): void {
        this._onTouched = fn;
    }

    private maskValue(actualValue, maskToApply) {
        console.log('======================================================================');
        console.log('actualValue' + actualValue);
        console.log('maskToApply' + maskToApply);
        let value = conformToMask(actualValue, maskToApply, { guide: false });
        console.log(value);
        this.render.setElementAttribute(this.el.nativeElement, 'value', value.conformedValue);
        this.el.nativeElement.value = value.conformedValue;
        this._onChange(value.conformedValue);
        console.log('======================================================================');
    }

    public getValidationRegExp(inputMask: string): string {
        let regExArray = [];
        let recursivePath;
        if (inputMask) {
            inputMask.split('').forEach(char => {
                let translation = this.translationMask[char];
                if (translation) {
                    if (translation.recursive) {
                        regExArray.push(char);
                        recursivePath = { digit: char, pattern: translation.pattern };
                    } else {
                        let pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
                        regExArray.push(translation.optional ? pattern + '?' : pattern);
                    }
                } else {
                    regExArray.push(char);
                }
            });
            let validationRegExp = regExArray.join('');
            if (recursivePath) {
                validationRegExp = validationRegExp.replace(
                    new RegExp('(' + recursivePath.digit + '(.*' + recursivePath.digit + ')?)'), '($1)?')
                    .replace(new RegExp(recursivePath.digit, 'g'), recursivePath.pattern);
            }
            return validationRegExp + '$';
        } else {
            return '';
        }
    }

    private getMaskArray(inputMask: string): any {
        let regExArray = [];
        if (inputMask) {
            inputMask.split('').forEach(char => {
                let translation = this.translationMask[char];
                if (translation) {
                    let pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
                    regExArray.push(translation.optional ? new RegExp(pattern + '?') : new RegExp(pattern));
                } else {
                    regExArray.push(char);
                }
            });
            return regExArray;
        } else {
            return false;
        }
    }

    public getMask(rawValue, inputMask): any {
        if (this.isUnlimtedCharMask(inputMask) && rawValue) {
            console.log(this.validationRegExp);
            if (new RegExp(this.validationRegExp).test(rawValue)) {
                let maskArray = [];
                rawValue.split('').forEach(char => {
                    if (this.isCharacter(char)) {
                        if (this.isUnlimtedCharAtStart(inputMask)) {
                            console.log('BEGINNING');
                            maskArray.unshift(this.letterRegEx);
                        } else {
                            console.log('END');
                            maskArray.push(this.letterRegEx);
                        }
                    } else if (this.isNumber(char)) {
                        maskArray.push(this.numberRegEx);
                    } else {
                        maskArray.push(char);
                    }
                });
                console.log('CHANGE MASK TO :' + maskArray);
                return maskArray;
            } else {
                return this.maskArray;
            }
        } else {
            return this.maskArray;
        }
    }

    private isCharacter(value: string): boolean {
        return /[a-zA-Z]/.test(value);
    }

    private isNumber(value: string): boolean {
        return /\d/.test(value);
    }

    private isUnlimtedCharMask(fieldMask: string) {
        return /^#|#$/.test(fieldMask);
    }

    private isUnlimtedCharAtStart(fieldMask: string) {
        return /^#/.test(fieldMask);
    }
}
