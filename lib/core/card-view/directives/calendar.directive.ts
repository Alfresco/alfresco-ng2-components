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

import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[adf-a11y-calendar]'
})
export class CalendarDirective {
    constructor() {}

    @HostListener('click') calendarClickA11yFixes() {
        this.roleBaseButtons();
        this.eventButtons();
    }
    @HostListener('document:keydown.enter') calendarKeyboardA11yFixes() {
        this.roleBaseButtons();
        this.eventButtons();
    }

      roleBaseButtons() {
        setTimeout(() => {
            const selectors = ['.mat-datetimepicker-calendar-previous-button', '.mat-datetimepicker-calendar-next-button', '.mat-datetimepicker-calendar-header-year',
            '.mat-datetimepicker-calendar-header-date', '.mat-datetimepicker-calendar-header-time' ];
            const calendarButtons = Array.from(document.getElementsByClassName('mat-datetimepicker-calendar-body-cell'));
            calendarButtons.forEach(e => {
                 e.setAttribute('role', 'button');
                 if (e.firstElementChild.classList.contains('mat-datetimepicker-calendar-body-selected')) {
                     e.firstElementChild.parentElement.setAttribute('aria-selected', 'true');
                 }
            });
            selectors.forEach(button => {
                  if (document.querySelector(button)) {
                  document.querySelector(button).setAttribute('role', 'button');
                  }
            });
            this.keyboardInstructions();
        }, 1000);
      }

      eventButtons() {
        setTimeout(() => {
            document.querySelector('.mat-datetimepicker-calendar-previous-button, .mat-datetimepicker-calendar-next-button').addEventListener('click', () => {
                this.roleBaseButtons();
            });
            document.querySelector('.mat-datetimepicker-calendar-header-year').addEventListener('click', () => {
                this.roleBaseButtons();
                document.querySelector('.mat-datetimepicker-calendar-previous-button').setAttribute('aria-label', 'previous year');
                document.querySelector('.mat-datetimepicker-calendar-next-button').setAttribute('aria-label', 'next year');
            });
            document.querySelector('.mat-datetimepicker-calendar-header-date').addEventListener('click', () => {
                this.roleBaseButtons();
                document.querySelector('.mat-datetimepicker-calendar-previous-button').setAttribute('aria-label', 'previous month');
                document.querySelector('.mat-datetimepicker-calendar-next-button').setAttribute('aria-label', 'next month');
            });
        }, 1000);
      }

      keyboardInstructions() {
           document.querySelector('.mat-datetimepicker-calendar-header-date').setAttribute('aria-live', 'polite');
           document.querySelector('.mat-datetimepicker-calendar').setAttribute('aria-label', 'Use arrow keys to navigate');
           document.querySelector('.mat-datetimepicker-calendar').setAttribute('role', 'dialog');
      }
}
