import * as path from "path";
import * as fs from "fs";
import * as process from "process"

import { GraphQLClient } from "graphql-request";
import * as remark from "remark";
import * as frontMatter from "remark-frontmatter";
import * as yaml from "js-yaml";
import * as moment from "moment";
import { Observable } from 'rxjs/Rx';

import * as libsearch from "./libsearch";
import { Stoplist } from "./stoplist";
import { last } from "rxjs/operator/last";


const adf20StartDate = "2017-11-20";

const commitWeight = 0.1;
const scoreTimeBase = 60;

const libFolder = "lib";
const stoplistFilePath = path.resolve("tools", "doc", "commitStoplist.json");

const angFilePattern = /(component)|(directive)|(model)|(pipe)|(service)|(widget)/;

let srcData = {};
let stoplist = new Stoplist(stoplistFilePath);

let docsFolderPath = path.resolve("docs");

let libFolders = ["core", "content-services", "process-services", "insights", "process-services-cloud"];

libsearch(srcData, path.resolve(libFolder));

/*
let keys = Object.keys(srcData);

for (let i = 0; i < keys.length; i++) {
  console.log(keys[i]);
}
*/

const authToken = process.env.graphAuthToken;

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    Authorization: 'Bearer ' + authToken
  }
});

const query = `query commitHistory($path: String) {
  repository(name: "alfresco-ng2-components", owner: "alfresco") {
    ref(qualifiedName: "development") {
      target {
        ... on Commit {
          history(first: 15, path: $path) {
            nodes {
              pushedDate
              message
            }
          }
        }
      }
    }
  }
}`;

let docFiles = getDocFilePaths(docsFolderPath);

let docNames = Observable.from(docFiles);

console.log("'Name','Review date','Commits since review','Score'");

docNames.subscribe(x => {
  let key = path.basename(x, ".md");

  if (!srcData[key])
    return;

  let vars = {
    "path": "lib/" + srcData[key].path
  };

  client.request(query, vars).then(data => {
      let nodes = data["repository"].ref.target.history.nodes;

      let lastReviewDate = getDocReviewDate(x);//(key + ".md");

      let numUsefulCommits = extractCommitInfo(nodes, lastReviewDate, stoplist);
      let dateString = lastReviewDate.format("YYYY-MM-DD");
      let score = priorityScore(lastReviewDate, numUsefulCommits).toPrecision(3);

      console.log(`'${key}','${dateString}','${numUsefulCommits}','${score}'`);
  });
});


function priorityScore(reviewDate, numCommits) {
  let daysSinceReview = moment().diff(reviewDate, 'days');
  let commitScore = 2 + numCommits * commitWeight;
  return Math.pow(commitScore, daysSinceReview / scoreTimeBase);
}


function getDocReviewDate(docFileName) {
  let mdFilePath = path.resolve(docsFolderPath, docFileName);

  let mdText = fs.readFileSync(mdFilePath);
  let tree = remark().use(frontMatter, ["yaml"]).parse(mdText);

  let lastReviewDate = moment(adf20StartDate);

  if (tree.children[0].type == "yaml") {
    let metadata = yaml.load(tree.children[0].value);

    if (metadata["Last reviewed"])
      lastReviewDate = moment(metadata["Last reviewed"]);
  }

  return lastReviewDate;
}


function extractCommitInfo(commitNodes, cutOffDate, stoplist) {
  let numUsefulCommits = 0;

  commitNodes.forEach(element => {
    if (!stoplist.isRejected(element.message)) {
      let abbr = element.message.substr(0, 15);

      let commitDate = moment(element.pushedDate);

      if (commitDate.isAfter(cutOffDate)) {
        numUsefulCommits++;
      }
    }
  });

  return numUsefulCommits;
}


function getDocFilePaths(folderPath) {
  let result = [];

  libFolders.forEach(element => {
    let libPath = path.resolve(folderPath, element);
    let files = fs.readdirSync(libPath);

    files = files.filter(filename =>
      (path.extname(filename) === ".md") &&
      (filename !== "README.md") &&
      (filename.match(angFilePattern))
    );

    files.forEach(element => {
      result.push(path.join(libPath, element));
    });
  });


  return result;
}
