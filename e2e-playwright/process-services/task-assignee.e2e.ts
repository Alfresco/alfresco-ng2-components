import { test } from "./fixtures/page-initialization";

test.describe.only('Task Assignee', () => {

    test('Candidate User Assignee', async ({ processServices }) => {
        await processServices.navigateTo({moduleNames:['adf-people'], componentName: 'adf-people', story: 'adf-people' });        
    });
});


// test.beforeAll(async () => {
//     //await processServices.navigateTo({moduleNames:['people-cloud'], componentName: 'people-cloud', story: 'valid-preselected-users' });

//     test('[C260387] Should the running process be displayed when clicking on Running filter', async ({ processServices }) => {

//         await processServices.navigateTo({moduleNames:['people-cloud'], componentName: 'people-cloud', story: 'valid-preselected-users' });

//     });
// });