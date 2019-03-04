import * as fs from 'fs';
import * as path from 'path';

import { graphql, buildSchema } from 'graphql';

import * as remark from 'remark';
import * as frontMatter from 'remark-frontmatter';
import { MDAST } from 'mdast';
import * as removePosInfo from 'unist-util-remove-position';

import * as MQ from './mqDefs';

let docFilePath = path.resolve('..', '..', 'docs', 'core', 'about.component.md');
let docSrc = fs.readFileSync(docFilePath, 'utf8');

let tree: MDAST.Root = remark()
.use(frontMatter, ["yaml"])
.parse(docSrc);

tree = removePosInfo(tree);

//console.log(JSON.stringify(tree));

let schema = buildSchema(MQ.schema);

let root = {
    document: () => new MQ.Root(tree)
};


let query = `
    {
        document {
          metadata(key: "Status")
          heading {
            link {
              text {
                value
              }
            }
          }
          paragraph {
            plaintext
          }
        }
    }
`;

graphql(schema, query, root).then((response) => {
  console.log(JSON.stringify(response));
});