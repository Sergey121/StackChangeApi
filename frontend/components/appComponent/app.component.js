import {Component, ViewEncapsulation} from '@angular/core';

import {template} from './app.component.pug';
import {style} from './app.component.scss';

@Component({
    selector: 'body',
    template: template,
    styles: [style],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent{}
