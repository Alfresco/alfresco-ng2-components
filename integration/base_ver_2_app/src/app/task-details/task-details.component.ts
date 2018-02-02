import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormRenderingService } from '@alfresco/adf-core';
import { CustomEditorComponent } from '../stencils.module';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {

  appId: string = null;
  taskId: string = null;
  fileShowed: any = null;
  content: any = null;
  contentName: any= null;

  constructor(private router: Router,
              private route: ActivatedRoute,
              formRenderingService: FormRenderingService) {
    formRenderingService.setComponentTypeResolver('testole_01', () => CustomEditorComponent, true);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.appId && params.appId !== '0') {
          this.appId = params.appId;
      }
      if (params.taskId) {
        this.taskId = params.taskId;
      }
    });
  }

  onFormContentClick(content: any): void {
    this.fileShowed = true;
    this.content = content.contentBlob;
    this.contentName = content.name;
  }

}
