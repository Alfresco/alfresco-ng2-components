import * as fs from 'fs';
import * as path from 'path';

import { graphql, buildSchema } from 'graphql';

import * as remark from 'remark';
import * as frontMatter from 'remark-frontmatter';
import { MDAST } from 'mdast';
import * as removePosInfo from 'unist-util-remove-position';

import { MQNode } from './mqDefs';

let docFilePath = path.resolve('..', '..', 'docs', 'core', 'testMd.md');
let docSrc = fs.readFileSync(docFilePath, 'utf8');

let tree: MDAST.Root = remark()
.use(frontMatter, ["yaml"])
.parse(docSrc);

tree = removePosInfo(tree);

//console.log(JSON.stringify(tree));

let schema = buildSchema(`
  type Query {
    document: Root
  }

  interface Node {
    type: String
  }

  interface Parent {
    type: String
    children: [Node]
  }

  type Root implements Parent {
    type: String
    children: [Node]
  }
`);

let root = {
    document: () => new MQNode(tree)
};

let node = {
    type: () => 'heading'
}

let query = `
    {
        document {
            type
            children {
              type
            }
        }
    }
`;

graphql(schema, query, root).then((response) => {
  console.log(response);
});