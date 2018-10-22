import { TaskDetailsCloudModel } from '../models/task-details-cloud.model';

export let taskDetailsMock = new TaskDetailsCloudModel({ assignee: 'fake-assigne', name: 'fake-name' });

export let mockUsers = [
    { id: 'fake-id-1', username: 'first-name-1 last-name-1', firstName: 'first-name-1', lastName: 'last-name-1' },
    { id: 'fake-id-2', username: 'first-name-2 last-name-2', firstName: 'first-name-2', lastName: 'last-name-2' },
    { id: 'fake-id-3', username: 'first-name-3 last-name-3', firstName: 'first-name-3', lastName: 'last-name-3' }
];
