import { DomSanitizer } from '@angular/platform-browser';

export const domSanitizerMock = {
    bypassSecurityTrustResourceUrl: () => {}
} as any as DomSanitizer;
