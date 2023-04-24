module.exports = async ({ github, context, checkLabels }) => {
  const { data: issue } = await github.rest.issues.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
  });
  const labels = issue.labels?.map(item => item.name);

  if (checkLabels.some(i => labels.includes(i))) {
    return true;
  }
  return false;
}
    