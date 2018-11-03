import { ProcessListCloudModule } from './process-list-cloud.module';

describe('ProcessListCloudModule', () => {
  let processListCloudModule: ProcessListCloudModule;

  beforeEach(() => {
    processListCloudModule = new ProcessListCloudModule();
  });

  it('should create an instance', () => {
    expect(processListCloudModule).toBeTruthy();
  });
});
