<template>
    <div class="wrapper">
        <sidebar-component></sidebar-component>

        <div class="main-panel">
            <navbar-component></navbar-component>

            <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        <card-component>
                            <template slot="header">A chart goes here.</template>
                            <template slot="title">Daily Sales</template>

                            <i class="fas fa-arrow-up"></i> <span class="text-success">55%</span> increase in today sales.

                            <template slot="footer">
                                <i class="fas fa-clock"></i> updated 4 minutes ago
                            </template>
                        </card-component>

                        <card-component level="warning">
                            <template slot="header">A chart goes here.</template>
                            <template slot="title">Email Subscriptions</template>

                            Last Campaign Performance

                            <template slot="footer">
                                <i class="fas fa-clock"></i> campaign sent 2 days ago
                            </template>
                        </card-component>

                        <card-component level="danger">
                            <template slot="header">A chart goes here.</template>
                            <template slot="title">Completed Tasks</template>

                            Last Campaign Performance

                            <template slot="footer">
                                <i class="fas fa-clock"></i> campaign sent 2 days ago
                            </template>
                        </card-component>
                    </div>
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
