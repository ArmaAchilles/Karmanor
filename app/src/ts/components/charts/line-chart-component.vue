<template>
    <div>
        <div class="ct-chart" ref="chart"></div>

        <button class="btn btn-primary" @click="changeData()">Change some data</button>
    </div>
</template>

<script>
    import Chartist from 'chartist';

    export default {
        props: {
            type: {
                type: String,
                default() {
                    return 'line';
                },
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
                // TODO: Make these actually passable from the parent component (props don't play nicely with watchers)
                series: [
                    [12, 17, 7, 17, 23, 18, 38],
                ],
                labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
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
        },

        methods: {
            refreshChart() {
                this.chart.update(this.data, this.options);
            },

            changeData() {
                this.series[0][0] += 1;
            },
        },

        watch: {
            labels() {
                this.refreshChart();
            },

            // TODO: This watcher doesn't work, probably due to the multiple array nesting.
            series: {
                deep: true,
                handler() {
                    this.refreshChart();
                },
            },
        },
    }
</script>

