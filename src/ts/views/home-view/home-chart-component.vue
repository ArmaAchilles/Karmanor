<template>
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
</template>

<script>
    import { ipcRenderer } from 'electron';
    import Settings from '../../settings';

    export default {
        data() {
            return {
                chartConnections: [0, 0, 0, 0, 0, 0, 0],
                chartRequests: [0, 0, 0, 0, 0, 0, 0],
            }
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

            window.events.$on('home-chart-increment', chartToIncrement => {
                if (chartToIncrement === 'chartConnections') {
                    this.incrementChartData(this.chartConnections);
                }
                else if (chartToIncrement === 'chartRequests') {
                    this.incrementChartData(this.chartRequests);
                }
            });
        },

        mounted() {
            let charts = Settings.get('chartsHome');

            if (! _.isEqual(charts, {})) {
                this.chartConnections = charts.connections;
                this.chartRequests = charts.requests;
            }

            window.events.$on('server-connection', () => {
                this.incrementChartData(this.chartConnections);
            });
        },

        computed: {
            day() {
                // 0 - Sunday, 1 - Monday etc.
                const date = new Date().getDay();

                if (date === 0) return 6;
                return new Date().getDay() - 1;
            },
        },

        methods: {
            incrementChartData(series) {
                series[this.day]++;

                window.events.$emit('chart-update');
            },
        }
    }
</script>
