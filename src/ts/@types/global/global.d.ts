import * as jQuery from 'jquery';

import { AxiosStatic } from 'axios';
import { LoDashStatic } from 'lodash';
import Popper from 'popper.js';
import Vue from 'vue';

declare global {
    namespace NodeJS {
        // tslint:disable-next-line: interface-name
        export interface Global {
            events: Vue;
            flash: (message: string, status?: string, isImportant?: boolean) => void;
        }
    }
}
