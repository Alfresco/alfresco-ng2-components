module.exports = async ({github, context, version}) => {

     const BRANCH_TO_CREATE = 'upstream-dependencies';

     const { data: prs } = await github.rest.pulls.list({
       owner: context.repo.owner,
       repo: context.repo.repo,
       state: 'open',
       head: `${context.repo.owner}:${BRANCH_TO_CREATE}`,
       base: 'develop'
     });

     if (prs?.length > 0) {
        const title = prs[0].title;
        const result = title.match(version);
        return result?.length > 0 ? true : false;
     }
     return false;
    
}
    