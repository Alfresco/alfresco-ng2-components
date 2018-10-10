import { AppListCloudModule } from './app-list-cloud.module';

describe('AppListCloudModule', () => {
  let appListCloudModule: AppListCloudModule;

  beforeEach(() => {
    appListCloudModule = new AppListCloudModule();
  });

  it('should create an instance', () => {
    expect(appListCloudModule).toBeTruthy();
  });
});
