import { StartTaskCloudModule } from './start-task-cloud.module';

describe('StartTaskCloudModule', () => {
  let startTaskCloudModule: StartTaskCloudModule;

  beforeEach(() => {
    startTaskCloudModule = new StartTaskCloudModule();
  });

  it('should create an instance', () => {
    expect(startTaskCloudModule).toBeTruthy();
  });
});
