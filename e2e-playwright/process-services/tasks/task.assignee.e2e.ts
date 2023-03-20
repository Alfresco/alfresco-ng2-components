import { createApiService,
    ApplicationsUtil,
    LoginPage,
    StartProcessPage,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { NavigationBarPage } from 'e2e/core/pages/navigation-bar.page';
import { ProcessServicesPage } from 'e2e/process-services/pages/process-services.page';
import { ProcessFiltersPage } from 'e2e/process-services/pages/process-filters.page';
import { ProcessServiceTabBarPage } from 'e2e/process-services/pages/process-service-tab-bar.page';
import { ProcessDetailsPage } from 'e2e/process-services/pages/process-details.page';
import { ProcessListPage } from '@alfresco/adf-testing';
//import { Browser } from '@playwright/test';

import { browser } from 'protractor';
import { TasksPage } from 'e2e/process-services/pages/tasks.page';

import CONSTANTS = require('../../util/constants');
import { AdminGroupsApi } from '@alfresco/js-api';

import { test,expect } from 'e2e-playwright/process-services-cloud/fixtures/page-initialization';

test.describe('Task Assignee', () => {

    const app = browser.params.resources.Files.TEST_ASSIGNEE;

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const processListPage = new ProcessListPage();
    const processFiltersPage = new ProcessFiltersPage();
    const startProcessPage = new StartProcessPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const processDetailsPage = new ProcessDetailsPage();
    const taskPage = new TasksPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);
    const adminGroupsApi = new AdminGroupsApi(apiService.getInstance());

    test.describe('Candidate User Assignee', () => {

        let user: UserModel;

        beforeEach(async () => {
            await apiService.loginWithProfile('admin');

            user = await usersActions.createUser(new UserModel({
                firstName: app.candidate.firstName,
                lastName: app.candidate.lastName
            }));

            try {// creates group if not available
                await adminGroupsApi.createNewGroup({
                    'name': app.candidateGroup,
                    'tenantId': user.tenantId,
                    'type': 1
                });
            } catch (e) {
            }

            await apiService.login(user.username, user.password);
            await applicationsService.importPublishDeployApp(app.file_path, { renewIdmEntries: true });

            await loginPage.login(user.username, user.password);
        });

        afterEach(async () => {
            await apiService.loginWithProfile('admin');
            await usersActions.deleteTenant(user.tenantId);
            await navigationBarPage.clickLogoutButton();
        });

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesPage();
            await processServicesPage.checkApsContainer();
        });

        test('[C260387] Should the running process be displayed when clicking on Running filter', async () => {
            const name = 'sample-process-one';
            await processServicesPage.goToApp(app.title);
            await processServiceTabBarPage.clickProcessButton();
            await expect(await processListPage.isProcessListDisplayed()).toEqual(true);
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.startProcess(name, app.processNames[0]);
            await processFiltersPage.selectFromProcessList(name);
            await processDetailsPage.activeTask.click();

            await taskPage.tasksListPage().checkContentIsDisplayed(app.userTasks.simple.one);
            await taskPage.tasksListPage().selectRow(app.userTasks.simple.one);
            await taskPage.taskDetails().clickCompleteFormTask();
            await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.simple.one);

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.simple.one);

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.simple.one);

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.taskDetails().clickCompleteFormTask();
            await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.simple.two);

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await taskPage.tasksListPage().checkContentIsDisplayed(app.userTasks.simple.two);
        });
    });
});
