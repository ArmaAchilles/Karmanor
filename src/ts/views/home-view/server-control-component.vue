<template>
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
</template>

<script>
    import Saved from '../../saved';
    import Server from '../../server';

    export default {
        data() {
            return {
                serverStarted: false,
                server: {},
                accessToken: '',
                zip: {},
            }
        },

        mounted() {
            window.events.$on('server-started', server => {
                this.serverStarted = true;

                this.server = server;
            });

            window.events.$on('server-data-received', () => {
                this.accessToken = this.server.accessToken;
                this.zip = this.server.zip;

                window.events.$emit('home-chart-increment', 'chartRequests');
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
        },
    }
</script>
