import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessInstance } from '@alfresco/adf-process-services';

@Component({
  selector: 'app-start-process',
  templateUrl: './start-process.component.html',
  styleUrls: ['./start-process.component.scss']
})
export class StartProcessComponent implements OnInit {

  appId: string = null;

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.appId && params.appId !== '0') {
          this.appId = params.appId;
      } else {
        this.router.navigate(['/apps']);
      }
    });
  }

  onProcessStarted(process: ProcessInstance) {
    this.router.navigate(['/apps', this.appId || 0, 'tasks']);
  }

  onCancelStartProcess() {
    this.router.navigate(['/apps', this.appId || 0, 'tasks']);
  }
}
