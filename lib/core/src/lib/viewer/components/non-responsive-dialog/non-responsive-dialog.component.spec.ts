import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonResponsiveDialogComponent } from './non-responsive-dialog.component';
import { By } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { NonResponsivePreviewActionsEnum } from '../../models/non-responsive-preview-actions.enum';
import { TranslateModule } from '@ngx-translate/core';
import { CoreTestingModule } from '@alfresco/adf-core';

const mockDialog = {
    close: jasmine.createSpy('close')
};

describe('NonResponsiveDialogComponent', () => {
    let matDialogRef: MatDialogRef<NonResponsiveDialogComponent>;
    let fixture: ComponentFixture<NonResponsiveDialogComponent>;

    const getButton = (buttonId: string) => {
        return fixture.debugElement.query(By.css(buttonId)).nativeElement;
    };

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [NonResponsiveDialogComponent],
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            providers: [
                { provide: MatDialogRef, useValue: mockDialog },
            ]
        });
        matDialogRef = TestBed.inject(MatDialogRef);

        fixture = TestBed.createComponent(NonResponsiveDialogComponent);
        fixture.detectChanges();
    });

    it('should emit NonResponsivePreviewActions.WAIT and close dialog when clicking on the wait button', async () => {
        const waitButton = getButton('#waitButton');
        waitButton.dispatchEvent(new Event('click'));

        await fixture.detectChanges()
        await fixture.whenStable();

        expect(matDialogRef.close).toHaveBeenCalledWith(NonResponsivePreviewActionsEnum.WAIT);
    });

    it('should emit NonResponsivePreviewActions.DOWNLOAD and close dialog when clicking on the download button', async () => {
        const waitButton = getButton('#downloadButton');
        waitButton.dispatchEvent(new Event('click'));

        await fixture.detectChanges()
        await fixture.whenStable();

        expect(matDialogRef.close).toHaveBeenCalledWith(NonResponsivePreviewActionsEnum.DOWNLOAD);
    });
});
