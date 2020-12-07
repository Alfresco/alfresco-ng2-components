const { AlfrescoApiCompatibility, PeopleApi } = require('@alfresco/js-api');
const program = require('commander');

const MAX_ATTEMPTS = 10;
const TIMEOUT = 60000;
const MAX_PEOPLE_PER_PAGE = 100;

let jsApiConnection;
let loginAttempts: number = 0;

export default async function main(_args: string[]) {
    
    program
        .version('0.1.0')
        .option('--host <type>', 'Remote environment host')
        .option('-p, --password <type>', 'password ')
        .option('-u, --username <type>', 'username ')
        .parse(process.argv);

    await attemptLogin();

    const peopleCount = await getPeopleCount();
    console.log('Active Users      :', peopleCount.enabled);
    console.log('Deactivated Users :', peopleCount.disabled);
}

async function attemptLogin() {
    try {
        jsApiConnection = new AlfrescoApiCompatibility({
            provider: 'ECM',
            hostEcm: program.host
        });
        await jsApiConnection.login(program.username, program.password);
    } catch (err) {
        console.log('Login error environment down or inaccessible');
        loginAttempts++;
        if (MAX_ATTEMPTS === loginAttempts) {
            console.log('Give up');
            process.exit(1);
        } else {
            console.log(`Retry in 1 minute attempt N ${loginAttempts}`);
            await wait(TIMEOUT);
            await attemptLogin();
        }
    }
}

interface PeopleTally { enabled: number, disabled: number }
async function getPeopleCount(skipCount: number = 0): Promise<PeopleTally> {
    try {
        const peopleApi = new PeopleApi(jsApiConnection);
        const apiResult = await peopleApi.listPeople({
            fields: ['enabled'],
            maxItems: MAX_PEOPLE_PER_PAGE,
            skipCount: skipCount
        });
        const result: PeopleTally = apiResult.list.entries.reduce((peopleTally: PeopleTally, currentPerson) => {
            if (currentPerson.entry.enabled) { peopleTally.enabled++; } else { peopleTally.disabled++; }
            return peopleTally;
        }, { enabled: 0, disabled: 0 });
        if (apiResult.list.pagination.hasMoreItems) {
            const more = await getPeopleCount(apiResult.list.pagination.skipCount + MAX_PEOPLE_PER_PAGE);
            result.enabled += more.enabled;
            result.disabled += more.disabled;
        }
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function wait(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
