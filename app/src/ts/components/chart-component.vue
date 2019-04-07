<template>
    <div class="ct-chart" ref="chart"></div>
</template>

<script>
    import Chartist from 'chartist';
    import { events } from '../flash';

    export default {
        props: {
            type: {
                type: String,
                default() {
                    return 'line';
                },
            },

            labels: {
                type: Array,
                default() {
                    return ['M', 'T', 'W', 'T', 'F', 'S', 'S']
                }
            },

            series: {
                type: Array,
                default() {
                    return [
                        [12, 17, 7, 17, 23, 18, 38],
                    ];
                }
            },

            options: {
                type: Object,
                default() {
                    return {
                        lineSmooth: Chartist.Interpolation.cardinal({
                            tension: 1,
                            fillHoles: true
                        }),
                        low: 0,
                        high: 5,
                        chartPadding: {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                        },
                    }
                }
            }
        },

        data() {
            return {
                chart: null,
            }
        },

        computed: {
            data() {
                return {
                    labels: this.labels,
                    series: this.series,
                }
            },
        },

        mounted() {
            switch (this.type) {
                case 'line':
                    this.chart = new Chartist.Line(this.$refs.chart, this.data, this.options);
                    break;

                case 'bar':
                    this.chart = new Chartist.Bar(this.$refs.chart, this.data, this.options);
                    break;

                case 'pie':
                    this.chart = new Chartist.Pie(this.$refs.chart, this.data, this.options);
                    break;

                default:
                    console.error(`${this.type} is not a valid Chartist chart type (line/bar/pie)!`);
                    break;
            }

            // Refresh the chart so that the option high value gets updated properly
            this.refreshChart();

            events.$on('chart-update', () => {
                this.refreshChart();
            });
        },

        methods: {
            refreshChart() {
                let largestValue = 0;

                this.series.forEach(serie => {
                    let max = _.max(serie);

                    if (max > largestValue) largestValue = max;
                });

                this.options.high = largestValue + 5;

                this.chart.update(this.data, this.options);
            },
        },

        watch: {
            labels() {
                this.refreshChart();
            },

            series: {
                deep: true,
                handler() {
                    this.refreshChart();
                },
            },
        },
    }
</script>

