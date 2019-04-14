<template>
    <div class="container-fluid">
        <div class="row">
            <card-component>
                <template slot="header">
                    <chart-component :series="[chartConnections]"></chart-component>
                </template>

                <template slot="title">
                    Server Connections
                </template>

                <template slot="category">
                    Connections that were established to our server.
                </template>
            </card-component>

            <card-component>
                <template slot="header">
                    <chart-component :series="[chartRequests]"></chart-component>
                </template>

                <template slot="title">
                    Proccessed Requests
                </template>

                <template slot="category">
                    How many requests we got and we sent data back.
                </template>
            </card-component>

            <card-component>
                <template slot="header">
                    <chart-component type="bar"></chart-component>
                </template>

                <template slot="title">
                    Another card
                </template>

                <template slot="category">
                    Just a template for some styling.
                </template>
            </card-component>
        </div>

        <div class="row">
            <card-component columnClass="col-lg-12" :status="serverStarted ? 'success' : 'warning'">
                <template slot="header">
                    Server is {{ serverStarted ? 'online' : 'offline' }}.
                </template>

                <template slot="title">
                    Server Controls
                </template>

                <template slot="category">
                    Toggle the server to listen for any incoming requests.
                </template>

                <button @click="startServer()" :disabled="serverStarted" class="btn btn-primary">Start Server</button>
                <button @click="stopServer()" :disabled="!serverStarted" class="btn btn-outline-danger">Stop Server</button>
            </card-component>
        </div>

        <div class="row" v-show="isDebug">
            <card-component columnClass="col-lg-12" status="info">
                <template slot="header">
                    Karmanor Debugging
                </template>

                <template slot="title">
                    Debug Controls
                </template>

                <template slot="category">
                    Toggle testing and other kinds of debug functionality.
                </template>

                <button class="btn btn-info" @click="startAutoTest()">Start Normal Auto Test</button>
                <button class="btn btn-info" @click="startAutoTest(true)">Start Rejected Auto Test</button>
            </card-component>
        </div>
    </div>
</template>

<script>
    import Server from '../server';
    import Settings, { Saved } from '../settings';
    import { ipcRenderer } from 'electron';
    import Test from '../test';

    export default {
        data() {
            return {
                serverStarted: false,
                server: {},
                accessToken: '',
                zip: {},

                chartConnections: [0, 0, 0, 0, 0, 0, 0],
                chartRequests: [0, 0, 0, 0, 0, 0, 0],
            }
        },

        computed: {
            day() {
                // 0 - Sunday, 1 - Monday etc.
                const date = new Date().getDay();

                if (date === 0) return 6;
                return new Date().getDay() - 1;
            },

            isDebug() {
                return window.NODE_ENV !== 'production';
            },
        },

        created() {
            ipcRenderer.on('chart-save', () => {
                Settings.save('chart-home', {
                    connections: this.chartConnections,
                    requests: this.chartRequests,
                }).then(() => {
                    ipcRenderer.sendSync('chart-saved');
                });
            });
        },

        mounted() {
            let charts = Saved.chartHome;

            if (! _.isEqual(charts, {})) {
                this.chartConnections = charts.connections;
                this.chartRequests = charts.requests;
            }

            window.events.$on('server-started', server => {
                this.serverStarted = true;

                this.server = server;
            });

            window.events.$on('server-connection', () => {
                this.incrementChartData(this.chartConnections);
            });

            window.events.$on('server-data-received', () => {
                this.accessToken = this.server.accessToken;
                this.zip = this.server.zip;

                this.incrementChartData(this.chartRequests);
            });

            window.events.$on('server-stopped', () => {
                this.serverStarted = false;
            });
        },

        methods: {
            startServer() {
                new Server(Saved.port).start().then(server => {
                    this.server = server;
                });
            },

            stopServer() {
                this.server.stop();
            },

            incrementChartData(series) {
                series[this.day]++;

                window.events.$emit('chart-update');
            },

            startAutoTest(reject = false) {
                Test.requests(reject);
            },
        },
    }
</script>
