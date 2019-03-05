import * as fs from 'fs';
import * as path from 'path';

import * as ejs from 'ejs';

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

    let schema = buildSchema(MQ.schema);

    libNamesList.forEach(libName => {
        graphql(schema, query, docset, null, {'libName': libName})
        .then((response) => {
            console.log(template(response['data']));
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