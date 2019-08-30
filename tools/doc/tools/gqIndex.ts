// tslint:disable: no-console

import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';
import * as remark from 'remark';
import * as frontMatter from 'remark-frontmatter';
import * as replaceZone from 'mdast-zone';
import { graphql, buildSchema } from 'graphql';
import * as MQ from '../mqDefs';

const libNamesList = [
    'content-services', 'core', 'extensions',
    'insights', 'process-services', 'process-services-cloud'
];

const query = `
    query libIndex($libName: String) {
        documents(idFilter: $libName) {
            title: metadata(key: "Title")
            status: metadata(key: "Status")
            id
            classType: folder(depth: 2)
            heading {
                link {
                    url
                }
            }
            paragraph {
                plaintext
            }
        }
    }
`;

export function processDocs(mdCache, aggData) {
    const docset: MQ.Docset = new MQ.Docset(mdCache);

    const templateFilePath = path.resolve(__dirname, '..', 'templates', 'gqIndex.ejs');
    const templateSource = fs.readFileSync(templateFilePath, 'utf8');
    const template = ejs.compile(templateSource);

    const indexFilePath = path.resolve(aggData['rootFolder'], 'docs', 'README.md');
    const indexFileText = fs.readFileSync(indexFilePath, 'utf8');
    const indexMD = remark()
    .use(frontMatter, ['yaml'])
    .parse(indexFileText);

    const schema = buildSchema(MQ.schema);

    libNamesList.forEach(libName => {
        graphql(schema, query, docset, null, {'libName': libName})
        .then((response) => {
            if (!response['data']) {
                console.log(JSON.stringify(response));
            } else {
                // console.log(template(response['data']));
                const newSection = remark().parse(template(response['data'])).children;

                replaceZone(indexMD, libName, (start, _oldZone, end) => {
                    newSection.unshift(start);
                    newSection.push(end);
                    return newSection;
                });

                const outText = remark()
                .use(frontMatter, {type: 'yaml', fence: '---'})
                .data('settings', {paddedTable: false, gfm: false})
                .stringify(indexMD);

                fs.writeFileSync(indexFilePath, outText);
            }
        });
    });

}
