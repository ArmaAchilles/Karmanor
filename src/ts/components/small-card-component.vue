<template>
    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
        <div class="card card-stats">
            <div class="card-header card-header-icon" :class="`${statusClass} ${hasFooter ? '' : 'pb-3'}`">
                <div class="card-icon">
                    <slot name="icon"></slot>
                </div>

                <p class="card-category"><slot></slot></p>

                <h3 class="card-title"><slot name="title"></slot></h3>
            </div>

            <div class="card-footer" v-show="hasFooter">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['status'],

        computed: {
            statusClass() {
                if (this.status !== '' && this.status !== undefined) {
                    return `card-header-${this.status}`;
                }

                if (this.status === '' || this.status === undefined) {
                    return 'card-header-success';
                }
            },

            hasFooter() {
                return !!this.$slots['footer'];
            },
        }
    }
</script>

