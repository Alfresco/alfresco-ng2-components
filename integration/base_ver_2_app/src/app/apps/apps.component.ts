import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppDefinitionRepresentationModel } from '@alfresco/adf-process-services';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css']
})
export class AppsComponent {

  constructor(private router: Router) { }

  onAppClicked(app: AppDefinitionRepresentationModel) {
    this.router.navigate(['/apps', app.id || 0, 'tasks']);
  }

}
