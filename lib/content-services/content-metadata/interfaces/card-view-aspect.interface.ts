import { CardViewItem} from '@alfresco/adf-core';
import { Aspect } from './aspect.interface';

export interface CardViewAspect extends Aspect {
    name: string;
    properties: CardViewItem[]
}
