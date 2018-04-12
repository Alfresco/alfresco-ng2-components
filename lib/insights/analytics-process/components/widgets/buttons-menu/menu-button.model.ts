export class MenuButton {
    label: string;
    icon: string;
    handler: Event;
    styles: string[];
    id: string;
    hidden: boolean;

    constructor(obj?: any) {
        this.label = obj.label;
        this.icon = obj.icon;
        this.handler = obj.handler;
        this.styles = obj.styles;
        this.id = obj.id;
        this.hidden = obj.hidden || false;
    }
}


