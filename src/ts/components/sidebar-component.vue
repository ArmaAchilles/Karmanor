<template>
    <div class="sidebar" data-color="azure" data-background-color="black" data-image="../images/sidebar-2.jpg">
        <div class="logo">
            <span class="simple-text logo-normal">Karmanor</span>
        </div>

        <div class="sidebar-wrapper">
            <ul class="nav">
                <sidebar-link-component to="/" icon="fa-chart-line">Dashboard</sidebar-link-component>

                <sidebar-link-component to="/settings" icon="fa-cogs">Settings</sidebar-link-component>
            </ul>
        </div>
    </div>
</template>
