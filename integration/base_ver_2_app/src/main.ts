import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { PDFJSStatic } from 'pdfjs-dist';

declare global {
  const PDFJS: PDFJSStatic;
}

import 'hammerjs';
import 'chart.js';
import 'ng2-charts';

PDFJS.workerSrc = 'pdf.worker.js';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
