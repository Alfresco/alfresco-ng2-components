import * as fs from 'fs';
import * as path from 'path';

import * as ejs from 'ejs';

import { graphql, buildSchema } from 'graphql';

import * as MQ from '../mqDefs';


let query = `
{
    documents {
        metadata(key: "Title")
        id
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

    let schema = buildSchema(MQ.schema);

    graphql(schema, query, docset).then((response) => {

        //console.log(JSON.stringify(response));

        let templateFilePath = path.resolve(__dirname, '..', 'templates', 'gqIndex.ejs');
        let templateSource = fs.readFileSync(templateFilePath, 'utf8');
        let template = ejs.compile(templateSource);

        console.log(template(response['data']));
    });
}


class GQDocset {
    public docs: MQ.Root[];

    constructor(mdCache) {
        this.docs = [];

        let pathnames = Object.keys(mdCache);

        pathnames.forEach(pathname => {

            if (!pathname.match(/README/)) {
                let doc = new MQ.Root(mdCache[pathname].mdInTree);
                doc.id = pathname;
                this.docs.push(doc);
            }
        });
    }

    documents(): MQ.Root[] {
        return this.docs;
    }

    name(): string {
        return "Another doc set";
    }

    size(): number {
        return this.docs.length;
    }
}