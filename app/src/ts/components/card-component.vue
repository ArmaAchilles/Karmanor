<template>
    <div class="col-xl-4 col-lg-12">
        <div class="card card-chart">
            <div name="header" v-show="hasHeader" class="card-header" :class="statusClass">
                <slot name="header"></slot>
            </div>

            <div class="card-body">
                <h4 class="card-title">
                    <slot class="card-title" name="title"></slot>
                </h4>

                <p class="card-category"><slot name="category"></slot></p>

                <slot></slot>
            </div>

            <div class="card-footer" v-show="hasFooter">
                <slot name="footer" class="card-footer"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            status: {
                type: String,
                default: 'success'
            },
        },

        computed: {
            statusClass() {
                    return `card-header-${this.status}`;
            },

            hasHeader() {
                return !!this.$slots['header'];
            },

            hasFooter() {
                return !!this.$slots['footer']
            }
        }
    }
</script>
