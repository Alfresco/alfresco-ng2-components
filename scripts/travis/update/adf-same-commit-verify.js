#!/usr/bin/env node

const GitHub = require('github-api');
let program = require('commander');

const ORGANISATION = 'Alfresco';
const ORIGIN_REPO = 'alfresco-ng2-components';

class PrCreator {
    constructor(githubUser, githubRepo, token, commit) {
        this.github = new GitHub({token});
        this.repoOrigin = this.github.getRepo(githubUser, ORIGIN_REPO);
        this.repoDestination = this.github.getRepo(githubUser, githubRepo);
        this.commit = commit;
    }

    async getShaClosedPr(head, base)  {
        return this.getShaPr(head, base, 'closed');
    }

    async getShaOpenPr(head, base)  {
        return this.getShaPr(head, base, 'open');
    }

    async getShaPr(head, base, status)  {
        const { data: closedUpstreamPRs }  = await this.repoDestination.listPullRequests({ state: status, head: `${ORGANISATION}:${head}`, base });
        if (closedUpstreamPRs.length > 0) {
            const latestClosedUpstream = closedUpstreamPRs[0];
            return latestClosedUpstream.body.split(':')[1].trim();
        }
        return '';
    }

}

async function main() {

    program
        .version('0.1.0')
        .option('--host [type]', 'Remote environment host adf.lab.com ')
        .option('-t, --token [type]', 'token')
        .option('-h, --head [type]', 'head')
        .option('-r, --repo [type]', 'repo')
        .option('-c, --commit [type]', 'commit')
        .parse(process.argv);

    const { token, head, repo, commit } = program,
        prCreator = new PrCreator(ORGANISATION, repo, token, commit);


    const baseBranchName = 'develop';

    const shaOpen = await prCreator.getShaOpenPr(head, baseBranchName);
    const shaClosed = await prCreator.getShaClosedPr(head, baseBranchName);
    if (shaOpen === commit || shaClosed === commit) {
        console.log('ADF sha already exist');
        return 'true';
    }
    return 'false';
}

main()
    .then(result => {
        process.stdout.write(result);
        process.exit(0);
    })
    .catch(error => {
        console.error(error.response.status);
        console.error(error.response.statusText);
        process.exit(1);
    });
