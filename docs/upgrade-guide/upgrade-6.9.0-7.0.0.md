---
Title: Upgrading from ADF v6.9 to v7.0
---

# Upgrading from ADF v6.9 to v7.0

This guide provides instructions on how to upgrade your v6.9.0 ADF projects to v7.0.0.

## Before you begin

Always perform upgrades on "clean" project state, backup your changes or make a project backup.

```shell
# Recommended clean up
nx reset && rm -rf .angular .nx dist node_modules nxcache tmp
```

## Libraries updates

Node version used is now 20.18.1.

### Breaking changes with libraries:

- Angular: 17.1.3
- Angular Material: 17.1.2
- Typescript: 5.3.3
- RXJS: 7.8.1
- NX: 20.0.0

Angular updates can be done with "Update Guide" from Angular documentation.

### Added libraries:
- eslint-plugin-storybook
- jasmine-marbles
- @editorjs/paragraph
- editorjs-text-alignment-blocktune
- graphql-ws

### Deleted libraries:
- protractor
- selenium-webdriver
- webdriver-manager
- shx
- monaco-editor
- ngx-monaco-editor-v2
- @types/selenium-webdriver
- protractor-retry-angular-cli
- protractor-screenshoter-plugin
- protractor-smartrunner

Reinstall your dependencies and make initial build:

```shell
npm i
npm run build
```

Review your applications as some styles and classes of Angular Material components might have changed.


## Demo-Shell and e2e
Demo shell and its e2e tests have been deleted.


## Material module
Material module is deprecated and will be removed in a future release. Please import components and modules independently.


## Standalone components
Most components have been changed to "standalone" and their modules have been deleted. Please import components directly.

| Deleted modules                |
|--------------------------------|
| AttachmentModule               |
| AppsListModule                 |
| TaskListModule                 |
| ProcessListModule              |
| ProcessUserInfoModule          |
| TaskCommentsModule             |
| ProcessCommentsModule          |
| PeopleModule                   |
| DynamicTableModule             |
| ContentWidgetModule            |
| AnalyticsProcessModule         |
| DiagramsModule                 |
| ButtonsMenuModule              |
| SitesDropdownModule            |
| DataColumnModule               |
| ContentUserInfoModule          |
| AppCardViewModule              |
| AppCloudSharedModule           |
| FileViewModule                 |
| AppProcessListModule           |
| FolderDirectiveModule          |
| ContentTypeModule              |
| SortingPickerModule            |
| ProcessServicesCloudPipeModule |
| StartTaskCloudModule           |
| ProcessDirectiveModule         |
| StartProcessCloudModule        |
| TaskDirectiveModule            |



## Removed components, directives and pipes
| Deleted components, directives and pipes |
|------------------------------------------|
| IsIncludedPipe                           |
| TabLabelsPipe                            |
| BooleanPipe                              |
| FilterOutArrayObjectsByPropPipe          |
| LocalizedRolePipe                        |
| MimeTypeIconPipe                         |
| FilterStringPipe                         |
| ProcessNameCloudPipe                     |
| FormStylePipe                            |
| CancelProcessDirective                   |
| MomentDateTimePipe                       |
| MomentDatePipe                           |


## A11y changes
Components have been reviewed and changed to fix most important issues with accessibility. Please test your application thoroughly to ensure that everything is working as expected, as some components have changed their structure, html roles or attributes.

| Components changed             | Description of changes                                               |
|--------------------------------|----------------------------------------------------------------------|
| Tooltips                       | Tooltips have been changed from Angular Material to standard tooltip |
| Search Page and Search Filters | mat-chip-option replaced with mat-chip                               |
| Columns Selector               | role attribute changes                                               |
| DataTable                      | role attribute changes                                               |
| Aspect List                    | structure of html changed                                            |


## Guards
All guards have been converted to functional guards (using the new Angular functional route guard pattern). Please review any custom guards in your application and adapt them to the functional pattern as needed.

Example of converting a class-based guard to a functional guard:

```typescript
// Before (class-based)
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate() {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}

// After (functional)
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true;
  }
  return router.parseUrl('/login');
};
```

## Model and interface changes

Some models and interfaces have changed:

| Before                        | After                 | Notes                        |
|-------------------------------|-----------------------|------------------------------|
| TaskDetailsModel              | TaskRepresentation    | Rename all instances         |
| IdentityUserFilterInterface   | Removed               | Use type definitions instead |
| IdentityUserServiceInterface  | Removed               | Use type definitions instead |
| TaskCloudServiceInterface     | Removed               | Use type definitions instead |


## Final steps

After you have updated the code, make sure to test your application thoroughly to ensure that everything is working as expected. Pay special attention to areas that use the renamed models or interfaces, and make sure all components are properly imported as standalone components.

If you encounter any issues during the upgrade process, refer to the Angular update guide or the ADF community for assistance.
