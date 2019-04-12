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
                        <label for="downloadDirectory" @click="openDirectory()" class="bmd-label-floating clickable">Press to select file download directory</label>
                        <span class="form-control clickable" id="downloadDirectory" @click="openDirectory()" v-text="downloadDirectory"></span>
                    </div>

                    <button class="btn btn-primary" :disabled="formDisabled([downloadDirectory])" @click="saveSettings('directories', {downloadDirectory})">Save Settings</button>
                </form>
            </card-component>

            <card-component status="primary">
                <template slot="header">
                    <h4 class="card-title">Game Settings</h4>
                </template>

                <form>
                    <div class="form-group">
                        <label for="gameExecutable" @click="openFile()" class="bmd-label-floating clickable">Press to select game executable path</label>
                        <span class="form-control clickable" id="gameExecutable" v-text="executable" @click="openFile()"></span>
                    </div>

                    <button class="btn btn-primary" :disabled="formDisabled([executable])" @click="saveSettings('game', {executable})">Save Settings</button>
                </form>
            </card-component>
        </div>
    </div>
</template>

<script>
    import Settings, { Saved } from '../settings';
    import Dialog from '../dialog';

    export default {
        data() {
            return {
                port: '',
                accessToken: '',

                downloadDirectory: '',

                executable: '',
            }
        },

        mounted() {
            this.port = Saved.port;
            this.accessToken = Saved.accessToken;
            this.downloadDirectory = Saved.downloadDirectory;
            this.executable = Saved.game.executable;
        },

        methods: {
            saveSettings(key, data) {
                Settings.save(key, data).then(isSaved => {
                    isSaved ? flash('Settings saved!') : flash(`You didn't change anything!`, 'info');
                }).catch(message => {
                    flash(message, 'danger', true);
                });
            },

            openDirectory() {
                let directory = Dialog.openDirectory();

                if (directory !== null) {
                    this.downloadDirectory = directory;
                }
            },

            openFile() {
                let file = Dialog.openFile([
                    {
                        name: 'Arma 3 Executable',
                        extensions: ['exe'],
                    }
                ]);

                if (file !== null) {
                    this.executable = file;
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

