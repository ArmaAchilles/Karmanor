import * as jQuery from 'jquery';

import { AxiosStatic } from 'axios';
import { LoDashStatic } from 'lodash';
import Popper from 'popper.js';
import Vue from 'vue';

export {};

declare global {
    // tslint:disable-next-line: interface-name
    interface Window {
        Popper: Popper;
        $: JQueryStatic;
        jQuery: JQueryStatic;
        axios: AxiosStatic;
        _: LoDashStatic;
        NODE_ENV: string;
        events: Vue;
        flash: (message: string, status?: string, isImportant?: boolean) => void;
    }

    // tslint:disable-next-line: interface-name
    interface JQuery {
        bootstrapMaterialDesign: () => void;
    }
}
