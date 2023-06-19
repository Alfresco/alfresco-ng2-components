const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
    const base = core.getInput('base', {required: false }) || '5288597580';
    core.setOutput('affected_is_empty', 'true');

    let affected = '';
    let myError = '';

    const options = {};
    options.listeners = {
        stdout: (data) => {
            affected += data.toString()
            },
        stderr: (data) => {
            myError += data.toString();
        }
    };

    await exec.exec(`npx nx print-affected --target=build --select=tasks.target.project --base=${base} --head=${head}`, [], options)
    
    const affectedTrimmed = affected.trim();
    if (affectedTrimmed !== '') {
        core.setOutput('affected_is_empty', 'false');
    }
    core.notice(`Retriving affected libs: ${affectedTrimmed}`);

    core.setOutput('affected', affectedTrimmed);
}

run();