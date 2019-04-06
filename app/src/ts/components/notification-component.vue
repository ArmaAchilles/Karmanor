<template>
    <li class="nav-item dropdown">
        <a class="nav-link" @click="onOpen()" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-bell fa-2x"></i>
            <span v-show="notViewed" class="notification">{{ notViewed }}</span>
            <p class="d-lg-none d-md-block">Notifications</p>
        </a>

        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
            <span @click.stop v-show="!count" class="dropdown-item dropdown-item-no-hover text-muted">No new notifications for you!</span>

            <a v-for="notification in notifications" :key="notification.id"
                @click.stop="removeNotification(notification)" class="dropdown-item">
                    {{ notification.message }}
            </a>
        </div>
    </li>
</template>

<script>
    export default {
        data() {
            return {
                notifications: [],
                viewed: 0,
            }
        },

        created() {
            window.events.$on('add-notification', message => {
                this.addNotification(message);
            });
        },

        computed: {
            count() {
                return this.notifications.length;
            },

            notViewed() {
                let notViewed = this.count - this.viewed;

                // So we don't get the notification bubble that says -1
                if (notViewed < 0) {
                    return 0;
                } else {
                    return notViewed;
                }
            },
        },

        methods: {
            addNotification(message) {
                this.notifications.push({
                    id: Math.random().toString(36).substr(2, 9),
                    message,
                });
            },

            removeNotification(notification) {
                const index = this.notifications.indexOf(notification);
                this.notifications.splice(index, 1);
            },

            onOpen() {
                if (this.count !== 0) {
                    this.viewed = this.count;
                } else {
                    this.viewed = 0;
                }
            },
        },
    }
</script>

<style scoped>
    a.dropdown-item:hover {
        color: #fff;
    }
</style>

