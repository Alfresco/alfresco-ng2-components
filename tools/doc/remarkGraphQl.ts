import * as fs from 'fs';
import * as path from 'path';

import { graphql, buildSchema } from 'graphql';

import * as remark from 'remark';
import * as frontMatter from 'remark-frontmatter';
import { MDAST } from 'mdast';
import * as removePosInfo from 'unist-util-remove-position';

import * as MQ from './mqDefs';

const docFilePath = path.resolve('..', '..', 'docs', 'core', 'about.component.md');
const docSrc = fs.readFileSync(docFilePath, 'utf8');

let tree: MDAST.Root = remark()
    .use(frontMatter, ['yaml'])
    .parse(docSrc);

tree = removePosInfo(tree);

const schema = buildSchema(MQ.schema);

const root = {
    document: () => new MQ.Root(tree)
};

const query = `
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
  // tslint:disable-next-line: no-console
  console.log(JSON.stringify(response));
});
