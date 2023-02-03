"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var process = require("process");
var graphql_request_1 = require("graphql-request");
var remark = require("remark");
var frontMatter = require("remark-frontmatter");
var yaml = require("js-yaml");
var moment = require("moment");
var rxjs_1 = require("rxjs");
var libsearch = require("./libsearch");
var stoplist_1 = require("./stoplist");
var adf20StartDate = '2017-11-20';
var commitWeight = 0.1;
var scoreTimeBase = 60;
var libFolder = 'lib';
var stoplistFilePath = path.resolve('tools', 'doc', 'commitStoplist.json');
var angFilePattern = /(component)|(directive)|(model)|(pipe)|(service)|(widget)/;
var srcData = {};
var stoplist = new stoplist_1.Stoplist(stoplistFilePath);
var docsFolderPath = path.resolve('docs');
var libFolders = ['core', 'content-services', 'extensions', 'insights', 'process-services', 'process-services-cloud'];
libsearch(srcData, path.resolve(libFolder));
var authToken = process.env.graphAuthToken;
var client = new graphql_request_1.GraphQLClient('https://api.github.com/graphql', {
    headers: {
        Authorization: 'Bearer ' + authToken
    }
});
var query = "query commitHistory($path: String) {\n  repository(name: \"alfresco-ng2-components\", owner: \"alfresco\") {\n    ref(qualifiedName: \"development\") {\n      target {\n        ... on Commit {\n          history(first: 15, path: $path) {\n            nodes {\n              pushedDate\n              message\n            }\n          }\n        }\n      }\n    }\n  }\n}";
var docFiles = getDocFilePaths(docsFolderPath);
var docNames = (0, rxjs_1.of)(docFiles);
console.log("'Name','Review date','Commits since review','Score'");
docNames.subscribe(function (docs) {
    docs.forEach(function (x) {
        var key = path.basename(x, '.md');
        if (!srcData[key]) {
            return;
        }
        var vars = {
            'path': 'lib/' + srcData[key].path
        };
        client.request(query, vars).then(function (data) {
            var nodes = data['repository'].ref.target.history.nodes;
            var lastReviewDate = getDocReviewDate(x); // (key + ".md");
            var numUsefulCommits = extractCommitInfo(nodes, lastReviewDate, stoplist);
            if (numUsefulCommits > 0) {
                var dateString = lastReviewDate.format('YYYY-MM-DD');
                var score = priorityScore(lastReviewDate, numUsefulCommits).toPrecision(3);
                console.log("'".concat(key, "','").concat(dateString, "','").concat(numUsefulCommits, "','").concat(score, "'"));
            }
        });
    });
});
function priorityScore(reviewDate, numCommits) {
    var daysSinceReview = moment().diff(reviewDate, 'days');
    var commitScore = 2 + numCommits * commitWeight;
    return Math.pow(commitScore, daysSinceReview / scoreTimeBase);
}
function getDocReviewDate(docFileName) {
    var mdFilePath = path.resolve(docsFolderPath, docFileName);
    var mdText = fs.readFileSync(mdFilePath);
    var tree = remark().use(frontMatter, ['yaml']).parse(mdText);
    var lastReviewDate = moment(adf20StartDate);
    if (tree.children[0].type === 'yaml') {
        var metadata = yaml.load(tree.children[0].value);
        if (metadata['Last reviewed']) {
            lastReviewDate = moment(metadata['Last reviewed']);
        }
    }
    return lastReviewDate;
}
function extractCommitInfo(commitNodes, cutOffDate, stoplist) {
    var numUsefulCommits = 0;
    commitNodes.forEach(function (element) {
        if (!stoplist.isRejected(element.message)) {
            // const abbr = element.message.substr(0, 15);
            var commitDate = moment(element.pushedDate);
            if (commitDate.isAfter(cutOffDate)) {
                numUsefulCommits++;
            }
        }
    });
    return numUsefulCommits;
}
function getDocFilePaths(folderPath) {
    var result = [];
    libFolders.forEach(function (element) {
        var libPath = path.resolve(folderPath, element);
        addItemsRecursively(libPath, result);
    });
    return result;
    function addItemsRecursively(elementPath, resultList) {
        var items = fs.readdirSync(elementPath);
        items.forEach(function (item) {
            var fullItemPath = path.resolve(elementPath, item);
            var itemInfo = fs.statSync(fullItemPath);
            if (itemInfo.isDirectory()) {
                addItemsRecursively(fullItemPath, resultList);
            }
            else if ((path.extname(fullItemPath) === '.md') &&
                (item !== 'README.md') &&
                (item.match(angFilePattern))) {
                resultList.push(fullItemPath);
            }
        });
    }
}
