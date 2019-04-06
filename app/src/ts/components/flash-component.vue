<template>
    <div class="alert-wrapper" v-show="notifications.length">
        <transition-group name="custom-classes-animation" :enter-active-class="`animated fast ${enterTransition}`" leave-active-class="animated slideOutRight">
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
                enterTransition: 'slideInRight',
            }
        },

        created() {
            window.events.$on(
                'flash', (message, status, isImportant) => this.flash(message, status, isImportant)
            );
        },

        methods: {
            flash(message, status = 'success', isImportant = false) {
                if (status === 'danger') {
                    this.enterTransition = 'shake';
                } else {
                    this.enterTransition = 'slideInRight';
                }

                this.notifications.push({
                    id: Math.random().toString(36).substr(2, 9),
                    message,
                    status,
                    icon: this.icon(status),
                    isImportant,
                });

                window.events.$emit('add-notification', message);

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
</style>
