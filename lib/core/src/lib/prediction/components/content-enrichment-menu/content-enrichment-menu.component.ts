/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfigurableFocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { TranslateModule } from '@ngx-translate/core';
import { Prediction, ReviewStatus } from '@alfresco/js-api';
import { IconComponent } from '../../../icon';
import { LocalizedDatePipe } from '../../../pipes';
import { PredictionService } from '../../services';
import { ObjectUtils } from '../../../common';

@Component({
    standalone: true,
    selector: 'adf-content-enrichment-menu',
    templateUrl: './content-enrichment-menu.component.html',
    styleUrls: ['./content-enrichment-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatButtonModule,
        IconComponent,
        MatMenuModule,
        MatIconModule,
        TranslateModule,
        LocalizedDatePipe
    ]
})
export class ContentEnrichmentMenuComponent implements OnInit {
    @Input()
    prediction: Prediction;

    @ViewChild('menuContainer', { static: false })
    menuContainer: ElementRef;

    @ViewChild('menuTrigger', { static: false })
    menuTrigger: MatMenuTrigger;

    focusTrap: ConfigurableFocusTrap;
    confidencePercentage: number;
    previousValue: any;
    predictionValue: any;
    predictionDateTime: Date;

    constructor(private predictionService: PredictionService, private focusTrapFactory: ConfigurableFocusTrapFactory) {}

    ngOnInit() {
        this.confidencePercentage = this.prediction?.confidenceLevel * 100 || 0;
        this.previousValue = ObjectUtils.isValueDefined(this.prediction?.previousValue) ? this.prediction.previousValue : '';
        this.predictionValue = ObjectUtils.isValueDefined(this.prediction?.predictionValue) ? this.prediction.predictionValue : '';
        this.predictionDateTime = this.prediction?.predictionDateTime || null;
    }

    onMenuOpen() {
        if (this.menuContainer && !this.focusTrap) {
            this.focusTrap = this.focusTrapFactory.create(this.menuContainer.nativeElement);
        }
    }

    onRevert() {
        this.predictionService.reviewPrediction(this.prediction.id, ReviewStatus.REJECTED).subscribe(() => {
            this.predictionService.predictionStatusUpdated$.next({ key: this.prediction.property, previousValue: this.previousValue });
            this.menuTrigger.closeMenu();
        });
    }

    onConfirm() {
        this.predictionService.reviewPrediction(this.prediction.id, ReviewStatus.CONFIRMED).subscribe(() => {
            this.predictionService.predictionStatusUpdated$.next({ key: this.prediction.property });
            this.menuTrigger.closeMenu();
        });
    }

    onClosed() {
        this.focusTrap.destroy();
        this.focusTrap = null;
    }
}
