<template>
    <transition>
        <div class="wrapper">
            <flash-component></flash-component>

            <sidebar-component></sidebar-component>

            <div class="main-panel">
                <navbar-component></navbar-component>

                <div class="content">
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        mounted() {
            //
        }
    }
</script>
