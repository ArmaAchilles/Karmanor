<template>
    <div class="alert-wrapper" v-show="notifications.length">
        <transition-group name="slide-fade">
            <div role="alert"
                v-for="notification in notifications"
                :class="`alert alert-${notification.status}`"
                :key="notification.id">
                    <i class="fas text-white" :class="notification.icon"></i>
                    <span v-text="notification.message"></span>

                    <button type="button" @click="hide(notification)" class="ml-2 close text-white" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
            </div>
        </transition-group>
    </div>
</template>

<script>
    export default {
        props: {
            timeout: {
                type: Number,
                default: 5000,
            },

            status: {
                type: String,
                default: 'success',
            },
        },

        data() {
            return {
                notifications: [],
            }
        },

        created() {
            window.events.$on(
                'flash', (message, status, isImportant) => this.flash(message, status, isImportant)
            );
        },

        methods: {
            flash(message, status = 'success', isImportant = false) {
                this.notifications.push({
                    id: Math.random().toString(36).substr(2, 9),
                    message,
                    status,
                    icon: this.icon(status),
                    isImportant,
                });

                setTimeout(() => this.hide(), this.timeout);
            },

            hide(notification = this.notifications[0]) {
                if (! notification.isImportant) {
                    const index = this.notifications.indexOf(notification);
                    this.notifications.splice(index, 1);
                }
            },

            icon(status) {
                const icons = {
                    'success': 'fa-check-circle',
                    'warning': 'fa-exclamation-triangle',
                    'danger': 'fa-exclamation-circle',
                    'info': 'fa-info-circle'
                };

                return icons[status];
            },
        },
    }
</script>

<style scoped>
    .alert-wrapper {
        position: fixed;
        right: 25px;
        bottom: 25px;
        z-index: 9999;
    }

    .alert span {
        display: inline;
    }

    .close {
        margin-top: 3px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .slide-fade-enter-active {
        transition: all .5s ease;
    }

    .slide-fade-leave-active {
        transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(10px);
        opacity: 0;
    }
</style>
