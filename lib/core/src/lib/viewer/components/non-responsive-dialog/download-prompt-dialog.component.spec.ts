import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPromptDialogComponent, DownloadPromptActions } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { CoreTestingModule } from '@alfresco/adf-core';

const mockDialog = {
    close: jasmine.createSpy('close')
};

describe('DownloadPromptDialogComponent', () => {
    let matDialogRef: MatDialogRef<DownloadPromptDialogComponent>;
    let fixture: ComponentFixture<DownloadPromptDialogComponent>;

    const getButton = (buttonId: string) => {
        return fixture.debugElement.query(By.css(buttonId)).nativeElement;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DownloadPromptDialogComponent],
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            providers: [
                { provide: MatDialogRef, useValue: mockDialog }
            ]
        });
        matDialogRef = TestBed.inject(MatDialogRef);

        fixture = TestBed.createComponent(DownloadPromptDialogComponent);
        fixture.detectChanges();
    });

    it('should emit DownloadPromptActions.WAIT and close dialog when clicking on the wait button', async () => {
        const waitButton = getButton('#waitButton');
        waitButton.dispatchEvent(new Event('click'));

        await fixture.detectChanges();
        await fixture.whenStable();

        expect(matDialogRef.close).toHaveBeenCalledWith(DownloadPromptActions.WAIT);
    });

    it('should emit DownloadPromptActions.DOWNLOAD and close dialog when clicking on the download button', async () => {
        const waitButton = getButton('#downloadButton');
        waitButton.dispatchEvent(new Event('click'));

        await fixture.detectChanges();
        await fixture.whenStable();

        expect(matDialogRef.close).toHaveBeenCalledWith(DownloadPromptActions.DOWNLOAD);
    });
});
