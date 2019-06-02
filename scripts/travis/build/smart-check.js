const request = require('request')
let program = require('commander');

WARM_UP_BUILD = 0;
UNIT_TEST_CORE = 1;
UNIT_TEST_CONTENT = 2;
UNIT_TEST_PROCESS = 3;
UNIT_TEST_PROCESS_CLOUD = 4;
UNIT_TEST_INSIGHTS = 5;
UNIT_TEST_EXTENSION = 6;
UNIT_TEST_DEMOSHELL = 7;
E2E_CORE = 8;
E2E_CONTENT = 9;
E2E_SEARCH = 10;
E2E_PROCESS = 11;
E2E_PROCESS_CLOUD = 12;

libsUnitTest = ['core$', 'content-services$', 'process-services$', 'process-services-cloud$', 'insights$', 'extensions$']

var mapLibsUnitTest = new Map();
mapLibsUnitTest.set(libsUnitTest[0], UNIT_TEST_CORE);
mapLibsUnitTest.set(libsUnitTest[1], UNIT_TEST_CONTENT);
mapLibsUnitTest.set(libsUnitTest[2], UNIT_TEST_PROCESS);
mapLibsUnitTest.set(libsUnitTest[3], UNIT_TEST_PROCESS_CLOUD);
mapLibsUnitTest.set(libsUnitTest[4], UNIT_TEST_INSIGHTS);
mapLibsUnitTest.set(libsUnitTest[5], UNIT_TEST_EXTENSION);

libse2e = ['core$', 'content-services$', 'process-services$', 'process-services-cloud$']

var mapLibsE2E = new Map();
mapLibsE2E.set(libse2e[0], E2E_CORE);
mapLibsE2E.set(libse2e[1], [E2E_CONTENT, E2E_SEARCH]);
mapLibsE2E.set(libse2e[2], E2E_PROCESS);
mapLibsE2E.set(libse2e[3], E2E_PROCESS_CLOUD);


async function main() {

    program
        .version('0.1.0')
        .option('--token [type]', 'Remote token ')
        .option('--affected [type]', 'Libs affected')
        .option('--buildId [type]', 'Build id')
        .parse(process.argv);

    if (program.affected !== true) {
        findJobs(program.token, program.buildId).then(
            (jobs) => {
                libsUnitTest.forEach(lib => {
                    console.log('Analize ' + lib + ' into ' +program.affected)
                    if (!program.affected.includes(lib)) {
                        console.log('lib ' + lib + ' not found')
                        deleteUnitTestJobNotAffectedByLib(jobs, lib);
                    } else {
                        console.log('lib ' + lib + ' is affected')
                    }
                });

                libse2e.forEach(lib => {

                    if (!program.affected.includes(lib)) {
                        console.log('lib ' + lib + ' not found')
                        deleteE2EJobNotAffectedByLib(jobs, lib);
                    } else {
                        console.log('lib ' + lib + ' is affected')
                    }
                });
            }
        );
    } else {
        console.log("Skip")
    }
}

function deleteUnitTestJobNotAffectedByLib(jobs, lib) {
    const index = mapLibsUnitTest.get(lib)
    console.log(`Cancel unit test ${lib} job with ${index} : ${jobs[index].id}`)
    cancelJob(program.token, jobs[index].id);
}

function deleteE2EJobNotAffectedByLib(jobs, lib) {
    const index = mapLibsE2E.get(lib)
    if (index.constructor === Array) {
        index.forEach((i) => {
            console.log(`Cancel E2E job with ${i} : ${jobs[i]}`)
            cancelJob(program.token, jobs[i].id);
        })
    } else {
        console.log(`Cancel E2E job with ${index} : ${jobs[index]}`)
        cancelJob(program.token, jobs[index].id);
    }
}

function cancelJob(token, jobId) {

    const baseRequest = request.defaults({
        headers: { 'Authorization': `token ${token}` }
    })

    baseRequest.post(`https://api.travis-ci.org/v3/job/${jobId}/cancel`, (error, res, body) => {
        if (error) {
            console.error(error)
            return
        }
        console.log(`statusCode: ${res.statusCode}`)
        console.log(body)
    })
}

function findJobs(token, buildId) {

    const baseRequest = request.defaults({
        headers: { 'Authorization': `token ${token}` }
    })

    return new Promise(function(resolve, reject) {
        baseRequest.get(`https://api.travis-ci.org/v3/build/${buildId}`, (error, res, body) => {
            if (error) {
                console.error(error)
                reject(err);
            }
            console.log(`statusCode: ${res.statusCode}`)
            const jobs = JSON.parse(body).jobs
            resolve(jobs);
        })
    })
}

main()
