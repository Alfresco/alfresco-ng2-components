import { TaskCloudModule } from './task-cloud.module';

describe('TaskCloudModule', () => {
  let taskCloudModule: TaskCloudModule;

  beforeEach(() => {
    taskCloudModule = new TaskCloudModule();
  });

  it('should create an instance', () => {
    expect(taskCloudModule).toBeTruthy();
  });
});
