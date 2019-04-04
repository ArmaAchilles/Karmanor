<template>
    <div class="sidebar" data-color="azure" data-background-color="black" data-image="../images/sidebar-2.jpg">
        <div class="logo">
            <span class="simple-text logo-normal">Karmanor</span>
        </div>

        <div class="sidebar-wrapper">
            <ul class="nav">
                <sidebar-link-component to="/" icon="fa-chart-line">Dashboard</sidebar-link-component>

                <li class="nav-item">
                    <a class="nav-link" href="./user.html">
                        <i class="fas fa-user"></i>
                        <p>User Profile</p>
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="./tables.html">
                        <i class="fas fa-clipboard"></i>
                        <p>Table List</p>
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="./typography.html">
                        <i class="fas fa-book"></i>
                        <p>Typography</p>
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="./icons.html">
                        <i class="fas fa-chart-pie"></i>
                        <p>Icons</p>
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="./map.html">
                        <i class="fas fa-map-marked-alt"></i>
                        <p>Maps</p>
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="./notifications.html">
                        <i class="fas fa-bell"></i>
                        <p>Notifications</p>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>
