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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ContentEnrichmentMenuComponent } from './content-enrichment-menu.component';
import { PredictionService } from '../../services';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { LocalizedDatePipe } from '../../../pipes/localized-date.pipe';
import { Prediction, ReviewStatus } from '@alfresco/js-api';

describe('ContentEnrichmentMenuComponent', () => {
    let component: ContentEnrichmentMenuComponent;
    let fixture: ComponentFixture<ContentEnrichmentMenuComponent>;
    let predictionService: PredictionService;
    let localizedDatePipe: LocalizedDatePipe;

    const predictionMock: Prediction = {
        confidenceLevel: 0.9,
        predictionDateTime: new Date(2022, 1, 1),
        modelId: 'test-model-id',
        property: 'test:test',
        id: 'test-prediction-id',
        previousValue: 'previous value',
        predictionValue: 'new value',
        updateType: 'AUTOCORRECT',
        reviewStatus: ReviewStatus.UNREVIEWED
    };

    const openMenu = () => {
        const button = fixture.debugElement.query(By.css('.adf-ai-button')).nativeElement;
        button.click();
        fixture.detectChanges();
    };

    beforeEach(async () => {
        const predictionServiceMock = {
            reviewPrediction: jasmine.createSpy('reviewPrediction').and.returnValue(of(null)),
            predictionStatusUpdated$: {next: jasmine.createSpy('next')}
        };

        await TestBed.configureTestingModule({
            imports: [ContentEnrichmentMenuComponent, CoreTestingModule, MatProgressSpinnerModule],
            providers: [{provide: PredictionService, useValue: predictionServiceMock}]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ContentEnrichmentMenuComponent);
        component = fixture.componentInstance;
        component.prediction = {...predictionMock};
        predictionService = TestBed.inject(PredictionService);
        localizedDatePipe = TestBed.inject(LocalizedDatePipe);
        fixture.detectChanges();
    });

    it('should initialize properties when prediction is provided', () => {
        expect(component.confidencePercentage).toBe(90);
        expect(component.previousValue).toBe('previous value');
        expect(component.predictionValue).toBe('new value');
        expect(component.predictionDateTime).toEqual(predictionMock.predictionDateTime);
    });

    it('should initialize properties with default values when prediction is not provided', () => {
        component.prediction = null;
        component.ngOnInit();

        expect(component.confidencePercentage).toBe(0);
        expect(component.previousValue).toBe('');
        expect(component.predictionValue).toBe('');
        expect(component.predictionDateTime).toBeNull();
    });

    it('should correctly set boolean values', () => {
        component.prediction.previousValue = false;
        component.prediction.predictionValue = true;
        component.ngOnInit();

        expect(component.previousValue).toBeFalse();
        expect(component.predictionValue).toBeTrue();
    });

    it('should call reviewPrediction with REJECTED on revert', () => {
        component.onRevert();
        expect(predictionService.reviewPrediction).toHaveBeenCalledWith(component.prediction.id, ReviewStatus.REJECTED);
    });

    it('should call reviewPrediction with CONFIRMED on confirm', () => {
        component.onConfirm();
        expect(predictionService.reviewPrediction).toHaveBeenCalledWith(component.prediction.id, ReviewStatus.CONFIRMED);
    });

    it('should emit predictionStatusUpdated$ on confirm', () => {
        component.onConfirm();
        expect(predictionService.predictionStatusUpdated$.next).toHaveBeenCalledWith({key: component.prediction.property});
    });

    it('should emit predictionStatusUpdated$ on revert', () => {
        component.onRevert();
        expect(predictionService.predictionStatusUpdated$.next).toHaveBeenCalledWith({
            key: component.prediction.property,
            previousValue: component.previousValue
        });
    });

    it('should close the menu on revert', () => {
        const menuTriggerSpy = spyOn(component.menuTrigger, 'closeMenu');
        component.onRevert();
        expect(menuTriggerSpy).toHaveBeenCalled();
    });

    it('should close the menu on confirm', () => {
        const menuTriggerSpy = spyOn(component.menuTrigger, 'closeMenu');
        component.onConfirm();
        expect(menuTriggerSpy).toHaveBeenCalled();
    });

    it('should open the menu on button click', () => {
        spyOn(component, 'onMenuOpen');
        openMenu();
        expect(component.onMenuOpen).toHaveBeenCalled();
    });

    it('should correctly format predictionDateTime using adfLocalizedDate', () => {
        const formattedDate = localizedDatePipe.transform(component.predictionDateTime, 'MM/dd/yyyy');
        openMenu();
        const dateElement = fixture.debugElement.query(By.css('.adf-content-enrichment-menu__content__label span')).nativeElement;
        expect(dateElement.textContent).toContain(formattedDate);
    });

    it('should render progress spinner with correct value', () => {
        openMenu();
        const spinnerElement = fixture.debugElement.query(By.css('.adf-accuracy-level-spinner'));
        expect(spinnerElement.nativeElement).toBeDefined();
        expect(spinnerElement.componentInstance.value).toEqual(component.confidencePercentage);
    });

    it('should render previous human entered value', () => {
        openMenu();
        const previousValueElement = fixture.debugElement.query(By.css('.adf-content-enrichment-menu__content__last__value')).nativeElement;
        expect(previousValueElement.textContent).toContain(component.previousValue);
    });

    it('should display "None" as previous value when previousValue is not defined', () => {
        component.prediction.previousValue = null;
        component.ngOnInit();
        openMenu();
        const previousValueElement = fixture.debugElement.query(By.css('.adf-content-enrichment-menu__content__last__value')).nativeElement;
        expect(previousValueElement.textContent).toContain('None');
    });

    it('should render predicted value', () => {
        openMenu();
        const predictionValueElement = fixture.debugElement.query(By.css('.adf-content-enrichment-menu__content__current__value span')).nativeElement;
        expect(predictionValueElement.textContent).toContain(component.predictionValue);
    });
});
