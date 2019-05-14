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

/* spellchecker: disable */
import { Injectable, Inject } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';
import { UserPreferencesService } from '../services/user-preferences.service';

@Injectable({
    providedIn: 'root'
})
export class DialogConfigService {
    constructor(
        @Inject(MAT_DIALOG_DEFAULT_OPTIONS) private defaultOptions: MatDialogConfig,
        private matDialogConfig: MatDialogConfig,
        private userPreferencesService: UserPreferencesService
    ) {
          this.userPreferencesService
            .select('textOrientation')
              .subscribe((direction: Direction) => {
                this.changeDirection(direction);
        });
    }

    loadDefaults() {
        Object.assign(this.defaultOptions, this.matDialogConfig, <MatDialogConfig> {
            autoFocus: true,
            closeOnNavigation: true
        });
    }

    private changeDirection(direction: Direction) {
        Object.assign(this.defaultOptions, this.matDialogConfig, <MatDialogConfig> {
            direction
        });
    }
}
