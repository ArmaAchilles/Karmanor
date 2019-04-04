<template>
    <div class="container-fluid">
        <div class="row">
            <card-component>
                <template slot="header"><chart-component></chart-component></template>

                <template slot="title">Daily Sales</template>

                <span class="text-success"><i class="fas fa-arrow-up"></i> 55%</span> increase in today sales.

                <template slot="footer">
                    <i class="fas fa-clock"></i> updated 4 minutes ago
                </template>
            </card-component>

            <card-component status="warning">
                <template slot="header"><chart-component type="bar"></chart-component></template>
                <template slot="title">Email Subscriptions</template>

                Last Campaign Performance

                <template slot="footer">
                    <i class="fas fa-clock"></i> campaign sent 2 days ago
                </template>
            </card-component>

            <card-component status="danger">
                <template slot="header"><chart-component></chart-component></template>
                <template slot="title">Completed Tasks</template>

                Last Campaign Performance

                <template slot="footer">
                    <i class="fas fa-clock"></i> campaign sent 2 days ago
                </template>
            </card-component>
        </div>

        <div class="row">
            <small-card-component status="warning">
                <i slot="icon" class="fas fa-copy"></i>

                Used Space

                <template slot="title">
                    49/50 <small>GB</small>
                </template>

                <template slot="footer">
                    <i class="fas fa-exclamation-triangle text-warning"></i>
                    <a href="#" class="text-warning">Get More Space...</a>
                </template>
            </small-card-component>

            <small-card-component>
                <i slot="icon" class="fas fa-dollar-sign"></i>

                Revenue

                <template slot="title">
                    $34,245
                </template>

                <template slot="footer">
                    <i class="fas fa-calendar-alt"></i>
                    Last 24 Hours
                </template>
            </small-card-component>

            <small-card-component status="danger">
                <i slot="icon" class="fas fa-info-circle"></i>

                Fixed issues

                <template slot="title">
                    75
                </template>

                <template slot="footer">
                    <i class="fas fa-tag"></i>
                    Tracked from GitHub
                </template>
            </small-card-component>

            <small-card-component status="info">
                <i slot="icon" class="fab fa-twitter"></i>

                Followers

                <template slot="title">
                    +245
                </template>

                <template slot="footer">
                    <i class="fas fa-stopwatch"></i>
                    Just Updated
                </template>
            </small-card-component>
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
        },
    }
</script>
