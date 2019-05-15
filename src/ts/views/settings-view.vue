<template>
    <div class="container-fluid">
        <div class="row">
            <card-component status="primary" columnClass="col-lg-12">
                <template slot="header">
                    <h4 class="card-title">Edit Settings</h4>
                </template>

                <form @submit.prevent="save">
                    <div class="form-group" v-for="setting in settings" :key="setting.key">
                        <label :for="setting.key" v-text="setting.beautifiedName" />
                        <input :id="setting.key" :name="setting.key" type="text" class="form-control" :value="setting.value">
                    </div>

                    <input type="submit" ref="submit" value="Save" class="btn btn-primary btn-block">
                </form>
            </card-component>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import * as _ from 'lodash';
    import Settings, { ISettings } from '../settings';

    export default Vue.extend({
        data() {
            return {
                settings: Settings.getAll(),
            }
        },

        methods: {
            save(event: Event) {
                let hasError = false;
                let hasChange = false;

                // @ts-ignore
                _.forEach(event.target, (element: HTMLFormElement) => {
                    if (element.name !== (this.$refs.submit as HTMLFormElement).name && element.name !== '') {
                        // TODO: This is an ugly mess
                        Settings.set(element.name as keyof ISettings, element.name === 'port' ? parseInt(element.value) : element.value)
                            // If hasChange has been already modified then we don't want to override it
                            .then(didSave => hasChange = hasChange ? hasChange : didSave)
                            .catch((error: Error) => { global.flash(error.message, 'danger', true); hasError = true; });
                    }
                });

                // TODO: Race condition
                if (! hasError) {
                    hasChange ? global.flash('Saved settings!') : global.flash(`You didn't change anything!`, 'info');
                }
            },
        },
    });
</script>
