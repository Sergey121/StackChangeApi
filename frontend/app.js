import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';

import {APP_COMPONENT, PAGE_COMPONENTS} from './components/index';
import {routes} from './app.routes';

import {InfiniteScrollModule} from 'angular2-infinite-scroll';

import * as services from './services';

const mapValuesToArray = (obj) => Object.keys(obj).map(key => obj[key]);

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        RouterModule.forRoot(routes, {
            useHash: true
        }),
        HttpModule,
        InfiniteScrollModule
    ],
    declarations: [APP_COMPONENT, PAGE_COMPONENTS],
    bootstrap: [APP_COMPONENT],
    providers: [
        ...mapValuesToArray(services)
    ]
})
class AppModule{}

platformBrowserDynamic().bootstrapModule(AppModule);
