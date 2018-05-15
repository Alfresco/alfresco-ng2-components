
export class MDNav {
    
    constructor(public root: any, public pos: number = 0) {}

    find(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        if (!this.root || !this.root.children) {
            return new MDNav(null);
        }

        let currIndex = 0;

        for (let i = this.pos; i < this.root.children.length; i++) {
            let child = this.root.children[i];

            if (test(child)) {
                if (currIndex === index) {
                    return new MDNav(this.root, i);
                } else {
                    currIndex++;
                }
            }
        }

        return new MDNav(this.root, this.root.children.length);
    }


    heading(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        return this.find((h) => {
            return h.type === "heading" && test(h);
        }, index);
    }


    table(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        return this.find((h) => {
            return h.type === "table" && test(h);
        }, index);
    }


    text(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        return this.find((h) => {
            return h.type === "text" && test(h);
        }, index);
    }


    tableRow(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        return this.find((h) => {
            return h.type === "tableRow" && test(h);
        }, index);
    }


    tableCell(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        return this.find((h) => {
            return h.type === "tableCell" && test(h);
        }, index);
    }

    get item(): any {
        if (!this.root || !this.root.children) {
            return undefined;
        } else {
            return this.root.children[this.pos];
        }
    }

    get empty(): boolean {
        return  !this.root ||
                !this.root.children ||
                (this.pos >= this.root.children.length);
    }

    
    get childNav() {
        return new MDNav(this.item);
    }
}