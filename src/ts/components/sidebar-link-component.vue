<template>
    <router-link tag="li" :to="to" class="nav-item">
        <router-link :to="to" class="nav-link">
            <i class="fas" :class="icon"></i>

            <p>
                <slot></slot>
            </p>
        </router-link>
    </router-link>
</template>

<script>
    export default {
        props: ['to', 'icon'],
    }
</script>

