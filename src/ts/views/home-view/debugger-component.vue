<template>
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
</template>

<script>
    import Test from '../../test';

    export default {
        computed: {
            isDebug() {
                return window.NODE_ENV !== 'production';
            },
        },

        methods: {
            startAutoTest(reject = false) {
                Test.requests(reject).then(didSucceed => {
                    didSucceed ? flash('The test succeeded!') : flash('The test failed!', 'danger', true);
                }).catch(error => {
                    flash('The test errored! See console!', 'danger', true)
                    console.error(error);
                });
            },
        }
    }
</script>

