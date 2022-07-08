const GitHub = require('github-api');
let program = require('commander');

const ORGANISATION = 'Alfresco';
const ORIGIN_REPO = 'alfresco-ng2-components';
const ATTEMPT_MSG = [
    `Could you check it please? 🤖`,
    `Emm did you forget? 🤡`,
    `Where are you? 🤷`,
    `We are going to die!! 👻`,
    `I guess that the Apocalypse happened and I am alone 👽`
];

GIVE_UP_MSG =  `I gave up, it would be fixed eventually 🔴`;

class PrCreator {
    constructor(githubUser, githubRepo, token, commit) {
        this.github = new GitHub({token});
        this.repoOrigin = this.github.getRepo(githubUser, ORIGIN_REPO);
        this.repoDestination = this.github.getRepo(githubUser, githubRepo);
        this.issue = this.github.getIssues(githubUser, githubRepo);
        this.commit = commit;
    }

    async createOrUpdate(title, head, base, commit) {
        const { data: prs } = await this.repoDestination.listPullRequests({ state: 'open', head: `${ORGANISATION}:${head}`, base });

        if (prs.length < 1) {
            const { data: pr } = await this.repoDestination.createPullRequest({ title, head, base, body: `sha:${commit}` });
            return pr.number;
        } else {
            const upstreamPrOpen = prs[0];
            // override the title to contains the latest adf dep number
            await this.repoDestination.updatePullRequest(upstreamPrOpen.number, { title, body: `sha:${commit}` });
            return upstreamPrOpen.number;
        }

    }

    async fetchContributors(shaFrom, shaTo)  {
        const mapAuthors = new Map();
        let upstreamShaFound = true;
        const listCommits = await this.repoOrigin.listCommits(({sha: shaFrom}))
        let index = 0;
        while(upstreamShaFound) {
            if (listCommits.data[index].sha === shaTo ) {
                upstreamShaFound = false;
            } else {
                mapAuthors.set(listCommits.data[index].author.login, listCommits.data[index].commit.author.name);
            }
            index++;
        }
        return mapAuthors;
    }

    async createComment(issueOrPrNumber, head, base, shaOriginHead )  {
        const shaTo = await this.getShaTo(head, base);
        const contributors = await this.fetchContributors(shaOriginHead, shaTo);
        const attemptCount = await this.getCommentAmount(issueOrPrNumber);
        const commentMsg = this.createCommentBody(contributors, attemptCount);
        await this.issue.createIssueComment(issueOrPrNumber, commentMsg);
    }

    createCommentBody(contributors, attemptCount)  {
        const flattenedContributors = this.flattenContributors(contributors);
        const attemptMsg = attemptCount <= 5 ? ATTEMPT_MSG[attemptCount] : GIVE_UP_MSG
        const tmpl = ` Attempt: ${attemptCount+1}
        you are part of the contributors:
        ${flattenedContributors}
        ${attemptMsg}
        `;
        return tmpl;
    }

    flattenContributors(contributors)  {
        let names = [];
        for (let key of contributors.keys()) {
            names.push(`@${key}`)
        }
        return names.join(', ');
    }

    async getShaTo(head, base)  {
        const { data: closedUpstreamPRs }  = await this.repoDestination.listPullRequests({ state: 'closed', head: `${ORGANISATION}:${head}`, base });
        const latestClosedUpstream = closedUpstreamPRs[0];
        const shaTo = latestClosedUpstream.body.split(':')[1].trim();
        return shaTo;
    }

    async getCommentAmount(issueOrPrNumber)  {
        const { data: listComments }  = await this.issue.listIssueComments(issueOrPrNumber);
        return listComments.length;
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
        .option('-title, --title [type]', 'title')
        .parse(process.argv);

    const { token, title, head, repo, commit } = program,
        prCreator = new PrCreator(ORGANISATION, repo, token, commit);

    if (!token || !head || !title) {
        throw new Error('Each of the parameters have to be provided. --token, --title, --head');
    }
    const baseBranchName = 'develop';

    const prNumber =  await prCreator.createOrUpdate(title, head, baseBranchName, commit);
    await prCreator.createComment(prNumber, head, baseBranchName, commit);

    return prNumber;
}

main()
    .then(prNumber => {
        console.log("======= PR Created =========");

        console.log(prNumber)
        process.exit(0);
    })
    .catch(error => {

        console.error("======= Impossible create PR =========");
        console.error(error.response.status);
        console.error(error.response.statusText);
        process.exit(1);
    });
