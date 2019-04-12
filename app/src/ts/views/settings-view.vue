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

                    <button class="btn btn-primary" :disabled="formDisabled([port, accessToken])" @click="saveSettings('server-settings', {port, accessToken})">Save Settings</button>
                </form>
            </card-component>

            <card-component status="primary">
                <template slot="header">
                    <h4 class="card-title">Directories</h4>
                </template>

                <form>
                    <div class="form-group">
                        <label for="downloadDirectory" @click="downloadClick()" class="bmd-label-floating clickable">Press to select file download directory</label>
                        <span class="form-control clickable" id="downloadDirectory" @click="downloadClick()" v-text="downloadDirectory"></span>
                    </div>

                    <button class="btn btn-primary" :disabled="formDisabled([downloadDirectory])" @click="saveSettings('directories', {downloadDirectory})">Save Settings</button>
                </form>
            </card-component>
        </div>
    </div>
</template>

<script>
    const { dialog } = require('electron').remote;

    import Settings, { Saved } from '../settings';

    export default {
        data() {
            return {
                port: '',
                accessToken: '',

                downloadDirectory: '',
            }
        },

        mounted() {
            this.port = Saved.port;
            this.accessToken = Saved.accessToken;
            this.downloadDirectory = Saved.downloadDirectory;
        },

        methods: {
            saveSettings(key, data) {
                Settings.save(key, data).then(isSaved => {
                    isSaved ? flash('Settings saved!') : flash(`You didn't change anything!`, 'info');
                }).catch(message => {
                    flash(message, 'danger', true);
                });
            },

            downloadClick() {
                let directories = dialog.showOpenDialog(null, {
                    properties: ['openDirectory']
                });

                // If user canceled the dialog
                if (directories !== undefined) {
                    this.downloadDirectory = directories[0];
                }
            },

            formDisabled(controls) {
                let isDisabled = false;

                controls.forEach(control => {
                    isDisabled = (control === '' ? true : false);
                });

                return isDisabled;
            },
        },
    }
</script>

<style scoped>
    .clickable {
        cursor: pointer;
    }
</style>

