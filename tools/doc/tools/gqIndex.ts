import * as fs from 'fs';
import * as path from 'path';

import * as ejs from 'ejs';

import * as remark from 'remark';
import * as frontMatter from 'remark-frontmatter';
import * as replaceZone from 'mdast-zone';

import { graphql, buildSchema } from 'graphql';

import * as MQ from '../mqDefs';

let libNamesRegex = /content-services|core|extensions|insights|process-services|process-services-cloud/;
let libNamesList = ['process-services'];


let query = `
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


export function processDocs(mdCache, aggData, _errorMessages) {
    let docset: GQDocset = new GQDocset(mdCache);

    let templateFilePath = path.resolve(__dirname, '..', 'templates', 'gqIndex.ejs');
    let templateSource = fs.readFileSync(templateFilePath, 'utf8');
    let template = ejs.compile(templateSource);

    let indexFilePath = path.resolve(aggData['rootFolder'], 'docs', 'README.md');
    let indexFileText = fs.readFileSync(indexFilePath, 'utf8');
    let indexMD = remark()
    .use(frontMatter, ["yaml"])
    .parse(indexFileText);

    let schema = buildSchema(MQ.schema);

    libNamesList.forEach(libName => {
        graphql(schema, query, docset, null, {'libName': libName})
        .then((response) => {
            if (!response['data']) {
                console.log(JSON.stringify(response));
            } else {
                //console.log(template(response['data']));
                let newSection = remark().parse(template(response['data'])).children;

                replaceZone(indexMD, libName, (start, _oldZone, end) => {
                    newSection.unshift(start);
                    newSection.push(end);
                    return newSection;
                });

                let outText = remark()
                .use(frontMatter, {type: 'yaml', fence: '---'})
                .data("settings", {paddedTable: false, gfm: false})
                .stringify(indexMD);

                fs.writeFileSync(indexFilePath, outText);
            }
        });
    });

    
}


class GQDocset {
    public docs: MQ.Root[];

    constructor(mdCache) {
        this.docs = [];

        let pathnames = Object.keys(mdCache);

        pathnames.forEach(pathname => {

            if (!pathname.match(/README/) &&
                pathname.match(libNamesRegex)
            ) {
                let doc = new MQ.Root(mdCache[pathname].mdInTree);
                doc.id = pathname.replace(/\\/g, '/');
                this.docs.push(doc);
            }
        });
    }

    documents(args): MQ.Root[] {
        if (args['idFilter'] === '') {
            return this.docs;
        } else {
            return this.docs.filter(doc => doc.id.indexOf(args['idFilter'] + '/') !== -1);
        }
    }

    size(): number {
        return this.docs.length;
    }
}