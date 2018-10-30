import { ProcessCloudModule } from './process-cloud.module';

describe('ProcessCloudModule', () => {
  let processCloudModule: ProcessCloudModule;

  beforeEach(() => {
    processCloudModule = new ProcessCloudModule();
  });

  it('should create an instance', () => {
    expect(processCloudModule).toBeTruthy();
  });
});
