/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  console.log(JSON.stringify(response));
});
