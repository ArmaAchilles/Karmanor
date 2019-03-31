<template>
    <div class="">
        <div class="wrapper">
            <div class="sidebar" data-color="purple" data-background-color="black" data-image="../images/sidebar-2.jpg">
                <div class="logo">
                    <a href="http://www.creative-tim.com" class="simple-text logo-normal">Karmanor</a>
                </div>

                <div class="sidebar-wrapper">
                    <ul class="nav">
                        <li class="nav-item active">
                            <a class="nav-link" href="./dashboard.html">
                                <i class="fas fa-chart-line"></i>
                                <p>Dashboard</p>
                            </a>
                        </li>

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

            <div class="main-panel">
                <nav class="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top " id="navigation-example">
                    <div class="container-fluid">
                        <div class="navbar-wrapper">
                            <a class="navbar-brand" href="javascript:void(0)">Dashboard</a>
                        </div>

                        <button class="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation" data-target="#navigation-example">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="navbar-toggler-icon icon-bar"></span>
                            <span class="navbar-toggler-icon icon-bar"></span>
                            <span class="navbar-toggler-icon icon-bar"></span>
                        </button>

                        <div class="collapse navbar-collapse justify-content-end">
                            <form class="navbar-form">
                                <div class="input-group no-border">
                                    <input type="text" value="" class="form-control" placeholder="Search...">

                                    <button type="submit" class="btn btn-default btn-round btn-just-icon">
                                        <i class="fas fa-search"></i>
                                        <div class="ripple-container"></div>
                                    </button>
                                </div>
                            </form>

                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a class="nav-link" href="javascript:void(0)">
                                        <i class="fas fa-chart-line"></i>
                                        <p class="d-lg-none d-md-block">Stats</p>
                                    </a>
                                </li>

                                <li class="nav-item dropdown">
                                    <a class="nav-link" href="javscript:void(0)" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-bell"></i>
                                        <span class="notification">5</span>
                                        <p class="d-lg-none d-md-block">Some Actions</p>
                                    </a>

                                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                                        <a class="dropdown-item" href="javascript:void(0)">Mike John responded to your email</a>
                                        <a class="dropdown-item" href="javascript:void(0)">You have 5 new tasks</a>
                                        <a class="dropdown-item" href="javascript:void(0)">You're now friend with Andrew</a>
                                        <a class="dropdown-item" href="javascript:void(0)">Another Notification</a>
                                        <a class="dropdown-item" href="javascript:void(0)">Another One</a>
                                    </div>
                                </li>

                                <li class="nav-item">
                                    <a class="nav-link" href="javascript:void(0)">
                                        <i class="fas fa-user"></i>
                                        <p class="d-lg-none d-md-block">Account</p>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div class="content">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-xl-4 col-lg-12">
                                <div class="card card-chart">
                                    <div class="card-header card-header-success">
                                        <div class="ct-chart" id="dailySalesChart"></div>
                                    </div>

                                    <div class="card-body">
                                        <h4 class="card-title">Daily Sales</h4>
                                        <p class="card-category">
                                        <span class="text-success"><i class="fa fa-long-arrow-up"></i> 55% </span> increase in today sales.</p>
                                    </div>

                                    <div class="card-footer">
                                        <div class="stats">
                                            <i class="fas fa-clock"></i> updated 4 minutes ago
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xl-4 col-lg-12">
                                <div class="card card-chart">
                                    <div class="card-header card-header-warning">
                                        <div class="ct-chart" id="websiteViewsChart"></div>
                                    </div>

                                    <div class="card-body">
                                        <h4 class="card-title">Email Subscriptions</h4>
                                        <p class="card-category">Last Campaign Performance</p>
                                    </div>

                                    <div class="card-footer">
                                        <div class="stats">
                                            <i class="fas fa-clock"></i> campaign sent 2 days ago
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Server from '../server';

    export default {
        name: 'home',

        data() {
            return {
                serverStarted: false,
                server: {},
                accessToken: '',
                zip: {},
            }
        },

        methods: {
            startServer() {
                this.server = new Server(8080);

                window.events.$on('server-started', () => {
                    this.serverStarted = true;
                })

                window.events.$on('server-data-received', () => {
                    this.accessToken = this.server.accessToken;
                    this.zip = this.server.zip;
                });
            },

            stopServer() {
                window.events.$on('server-stopped', () => {
                    this.serverStarted = false;
                });

                this.server.stop();
            },
        }
    }
</script>
