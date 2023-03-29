import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileAutoDownloadComponent } from './file-auto-download.component';
import { MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { FileAutoDownloadActionsEnum } from '../../models/file-auto-download-actions.enum';
import { CoreTestingModule } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';

const mockDialog = {
    close: jasmine.createSpy('close')
};
describe('FileAutoDownloadComponent', () => {
    let matDialogRef: MatDialogRef<FileAutoDownloadComponent>;
    let fixture: ComponentFixture<FileAutoDownloadComponent>;

    const getButton = (buttonId: string) => {
        return fixture.debugElement.query(By.css(buttonId)).nativeElement;
    };

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [FileAutoDownloadComponent],
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            providers: [
                { provide: MatDialogRef, useValue: mockDialog },
            ]
        });

        fixture = TestBed.createComponent(FileAutoDownloadComponent);
        matDialogRef = TestBed.inject(MatDialogRef);
        fixture.detectChanges();
    });

    it('should emit FileAutoDownloadActionsEnum.CANCEL and close dialog when clicking on the cancel button', async () => {
        const waitButton = getButton('#cancelButton');
        waitButton.dispatchEvent(new Event('click'));

        await fixture.detectChanges();
        await fixture.whenStable();

        expect(matDialogRef.close).toHaveBeenCalledWith(FileAutoDownloadActionsEnum.CANCEL);
    });

    it('should emit FileAutoDownloadActionsEnum.DOWNLOAD and close dialog when clicking on the wait button', async () => {
        const waitButton = getButton('#downloadButton');
        waitButton.dispatchEvent(new Event('click'));

        await fixture.detectChanges();
        await fixture.whenStable();

        expect(matDialogRef.close).toHaveBeenCalledWith(FileAutoDownloadActionsEnum.DOWNLOAD);
    });
});
