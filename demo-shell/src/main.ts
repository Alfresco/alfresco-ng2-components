import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';
import 'chart.js';
import 'ng2-charts';

import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.PDFJS.workerSrc = 'pdf.worker.js';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
