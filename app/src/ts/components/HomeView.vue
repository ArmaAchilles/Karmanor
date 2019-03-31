<template>
    <div class="container py-3">
        <div class="row">
            <div class="card mx-auto">
                <div class="card-header">
                    <h2>Karmanor</h2>
                </div>

                <div class="card-body">
                    <span>An Electron app which builds source code from ArmA 3 PBOs and runs the game with the built PBOs and runs testing functionality.</span>

                    <div>
                        <ul>
                            <li>{{ accessToken }}</li>
                            <li>{{ JSON.stringify(zip) }}</li>
                        </ul>
                    </div>
                </div>

                <div class="card-footer">
                    <button class="btn btn-primary" :disabled="serverStarted" @click="startServer()">Start Server</button>
                    <button class="btn btn-outline-danger" :disabled="!serverStarted" @click="stopServer()">Stop Server</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Server from '../server';

    export default {
        name: 'home',

        data() {
            return {
                serverStarted: false,
                server: {},
                accessToken: '',
                zip: {},
            }
        },

        methods: {
            startServer() {
                this.server = new Server(8080);

                window.events.$on('server-started', () => {
                    this.serverStarted = true;
                })

                window.events.$on('server-data-received', () => {
                    this.accessToken = this.server.accessToken;
                    this.zip = this.server.zip;
                });
            },

            stopServer() {
                window.events.$on('server-stopped', () => {
                    this.serverStarted = false;
                });

                this.server.stop();
            },
        }
    }
</script>
