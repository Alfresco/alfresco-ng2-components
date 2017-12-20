import { AspectProperty } from "./aspect-property.interface";

export interface Aspect {
    name: string;
    title: string;
    description: string;
    properties: AspectProperty[]
}
