import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HelloReact } from './component-one';

const containerElementName = 'reactComponentContainer';

@Component({
    selector: 'app-react-component',
    template: `
        <span #${containerElementName}></span>
    `,
    encapsulation: ViewEncapsulation.None
})
export class ReactWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
    @ViewChild(containerElementName, { static: false })
    containerRef: ElementRef;

    @Input() data = { name: 'David'};

    @Output() eventEmitter = new EventEmitter<void>();

    constructor() {
        this.handleDivClicked = this.handleDivClicked.bind(this);
    }

    // ngOnChanges(): void {
    //     this.render();
    // }

    ngAfterViewInit() {
        this.render();
    }

    ngOnDestroy() {
        ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
    }

    handleDivClicked() {
        if (this.eventEmitter) {
            this.eventEmitter.emit();
            this.render();
            alert('Hi there!');
        }
    }

    private render() {
        const { data } = this;

        ReactDOM.render(
            <div>
                <HelloReact name={data.name} onClick={this.handleDivClicked} />
            </div>,
            this.containerRef.nativeElement
        );
    }
}
