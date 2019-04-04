<template>
    <div class="container-fluid">
        <div class="row">
            <card-component status="primary">
                <template slot="header">
                    <h4 class="card-title">Server Settings</h4>
                </template>

                <form>
                    <div class="form-group">
                        <label for="port" class="bmd-label-floating">Server Port</label>
                        <input type="text" id="port" required class="form-control" v-model="port">
                    </div>

                    <div class="form-group">
                        <label for="accessToken" class="bmd-label-floating">Access Token</label>
                        <input id="accessToken" required class="form-control" type="text" v-model="accessToken">
                    </div>

                    <button class="btn btn-primary" :disabled="formDisabled" @click="saveSettings()">Save Settings</button>
                </form>
            </card-component>
        </div>
    </div>
</template>

<script>
    import * as _ from 'lodash';
    import * as Settings from 'electron-settings';

    export default {
        data() {
            return {
                port: '',
                accessToken: '',
            }
        },

        mounted() {
            if (Settings.has('server-settings')) {
                this.port = Settings.get('server-settings.port', '');
                this.accessToken = Settings.get('server-settings.accessToken', '');
            }
        },

        computed: {
            formDisabled() {
                return (this.port === '' || this.accessToken === '');
            }
        },

        methods: {
            saveSettings() {
                let data = {
                    port: this.port,
                    accessToken: this.accessToken,
                }

                Settings.set('server-settings', data);

                if (_.isEqual(Settings.get('server-settings'), data)) {
                    flash('Settings saved!');
                } else {
                    flash('Settings failed to save!', 'danger');
                }
            },
        },
    }
</script>

