const GitHub = require('github-api');
let program = require('commander');

const ORGANISATION = 'Alfresco';

class PrCreator {
    constructor(githubUser, githubRepo, token) {
        this.github = new GitHub({token});
        this.repo = this.github.getRepo(githubUser, githubRepo);
    }

    async create(title, head, base) {
        const { data: prs } = await this.repo.listPullRequests({ state: 'open', head: `${ORGANISATION}:${head}`, base });

        if (prs.length < 1) {
            const { data: pr } = await this.repo.createPullRequest({ title, head, base });
            return pr.number;
        } else {
            // override the title to contains the latest adf dep number
            prs[0].title = title;
        }

        return prs[0].number;
    }
}

async function main() {

    program
        .version('0.1.0')
        .option('--host [type]', 'Remote environment host adf.lab.com ')
        .option('-t, --token [type]', 'token')
        .option('-h, --head [type]', 'head')
        .option('-r, --repo [type]', 'repo')
        .option('-title, --title [type]', 'title')
        .parse(process.argv);

    const { token, title, head, repo } = program,
        prCreator = new PrCreator(ORGANISATION, repo, token);

    if (!token || !head || !title) {
        throw new Error('Each of the parameters have to be provided. --token, --title, --head');
    }

    return prCreator.create(title, head, 'develop');
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
