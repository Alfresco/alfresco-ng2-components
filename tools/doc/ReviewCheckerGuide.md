# Review checker guide

The review checker tool queries the Github repo to look for recent
commits to the component source files. The dates of these commits
are compared against against a review date stored in the Markdown doc
file for each component. The time and the number of commits since the
last review are then combined into a "score" that gives an indication
of how urgently the doc file needs a review.

## Review date metadata

The review date is kept in the YAML metadata section at the top of each
Markdown file. The key is "Last reviewed" and the date is in the form
YYYY-MM-DD.

## Commit message stoplist

The checker will ignore any commits that match regular expressions stored
in the `commitStoplist.json` file in the `DocProcessor` folder. You could
use this, for example, to filter out JIRA tasks that don't involve any
changes in functionality (and therefore don't need documenting).

## Output format

The script sends comma-separated text to the command line. You can copy/paste
this into a spreadsheet or redirect the output to a text file with a ".csv"
suffix.

To use this tool you need before to set graphAuthToken variable with you github access token:

export graphAuthToken=GITHUB_TOKEN

npm run review-checker
