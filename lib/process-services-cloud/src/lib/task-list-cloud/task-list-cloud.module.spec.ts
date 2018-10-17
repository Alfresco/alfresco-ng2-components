import { TaskListCloudModule } from './task-list-cloud.module';

describe('TaskListCloudModule', () => {
  let taskListCloudModule: TaskListCloudModule;

  beforeEach(() => {
    taskListCloudModule = new TaskListCloudModule();
  });

  it('should create an instance', () => {
    expect(taskListCloudModule).toBeTruthy();
  });
});
