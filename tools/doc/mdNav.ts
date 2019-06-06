
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

    findAll(test: (element: any) => boolean = () => true, index: number = 0): MDNav[] {
        if (!this.root || !this.root.children) {
            return [];
        }

        let result = [];

        let currIndex = 0;

        for (let i = this.pos; i < this.root.children.length; i++) {
            let child = this.root.children[i];

            if (test(child)) {
                if (currIndex === index) {
                    result.push(new MDNav(this.root, i));
                } else {
                    currIndex++;
                }
            }
        }

        return result;
    }


    emph(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        return this.find((h) => {
            return h.type === "emphasis" && test(h);
        }, index);
    }


    heading(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        return this.find((h) => {
            return h.type === "heading" && test(h);
        }, index);
    }


    headings(test: (element: any) => boolean = () => true, index: number = 0): MDNav[] {
        return this.findAll((h) => {
            return h.type === "heading" && test(h);
        }, index);
    }


    html(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        return this.find((h) => {
            return h.type === "html" && test(h);
        }, index);
    }

    link(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        return this.find((h) => {
            return h.type === "link" && test(h);
        }, index);
    }

    links(test: (element: any) => boolean = () => true, index: number = 0): MDNav[] {
        return this.findAll((h) => {
            return h.type === "link" && test(h);
        }, index);
    }

    list(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        return this.find((h) => {
            return h.type === "list" && test(h);
        }, index);
    }


    listItem(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        return this.find((h) => {
            return h.type === "listItem" && test(h);
        }, index);
    }

    listItems(test: (element: any) => boolean = () => true, index: number = 0): MDNav[] {
        return this.findAll((h) => {
            return h.type === "listItem" && test(h);
        }, index);
    }

    paragraph(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        return this.find((h) => {
            return h.type === "paragraph" && test(h);
        }, index);
    }


    strong(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        return this.find((h) => {
            return h.type === "strong" && test(h);
        }, index);
    }


    table(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        return this.find((h) => {
            return h.type === "table" && test(h);
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


    text(test: (element: any) => boolean = () => true, index: number = 0): MDNav {
        return this.find((h) => {
            return h.type === "text" && test(h);
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


    get childNav(): MDNav {
        return new MDNav(this.item);
    }


    get value(): any {
        if (this.item && this.item["value"]) {
            return this.item.value;
        } else {
            return "";
        }
    }


    get textValue() : string {
        if (this.item) {
            if (this.item["value"]) {
                return this.item.value;
            } else if (
                this.item.children &&
                (this.item.children.length > 0) &&
                (this.item.children[0].type === "text")
            ){
                return this.item.children[0].value;
            } else {
                return "";
            }
        } else {
            return "";
        }
    }
}
