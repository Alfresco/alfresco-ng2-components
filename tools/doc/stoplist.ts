import * as fs from 'fs';

/* "Stoplist" of regular expressions to match against strings. */
export class Stoplist {
    regexes: RegExp[];

    constructor(slFilePath: string) {
        const listExpressions = JSON.parse(fs.readFileSync(slFilePath, 'utf8'));
        this.regexes = [];

        if (listExpressions) {
            for (let i = 0; i < listExpressions.length; i++) {
                this.regexes.push(new RegExp(listExpressions[i]));
            }
        } else {
            this.regexes = [];
        }
    }

    // Check if an item is covered by the stoplist and reject it if so.
    isRejected(itemName: string) {
        for (let i = 0; i < this.regexes.length; i++) {
            if (this.regexes[i].test(itemName)) {
                return true;
            }
        }

        return false;
    }

}
