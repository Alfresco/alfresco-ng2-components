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

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SidenavSizerService } from '../../services/sidenav-sizer.service';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-sidenav-sizer',
    templateUrl: 'sidenav-sizer.component.html',
    styleUrls: ['sidenav-sizer.component.scss']
})
export class SidenavSizerComponent implements OnInit {

    sidenavMax: FormControl = new FormControl();
    sidenavMin: FormControl = new FormControl();

    constructor(private sidenavSizerService: SidenavSizerService) {

    }

    ngOnInit() {
        this.sidenavMax.valueChanges
        .pipe(
            debounceTime(200)
        )
        .subscribe((maxValue) => {
            this.sidenavSizerService.changeSidenavMax(maxValue);
        });

        this.sidenavMin.valueChanges
        .pipe(
            debounceTime(200)
        )
        .subscribe((minValue) => {
            this.sidenavSizerService.changeSidenavMin(minValue);
        });
    }

    resetToDefault() {
        this.sidenavMax.setValue(220);
        this.sidenavMin.setValue(70);
    }
}
