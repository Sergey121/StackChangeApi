import {Component, Inject, EventEmitter, Output} from '@angular/core';
import {template} from './modal.component.pug';
import {style} from './modal.component.scss';

@Component({
    selector: 'modal',
    template: template,
    styles: [style],
    inputs: ['open'],
    outputs: ['close'],
    host: {'(click)': 'checkClickOutside($event)'},
})
export class ModalComponent {
    constructor() {
        this.close = new EventEmitter();
    };

    closeModal() {
        this.close.emit();
    }

    checkClickOutside(event) {
        let target = event.target || event.srcElement;
        if (target.id === 'overlay') {
            this.closeModal();
        }
    }
}
