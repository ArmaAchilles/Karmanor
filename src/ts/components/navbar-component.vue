<template>
    <nav class="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top " id="navigation-example">
        <div class="container-fluid">
            <div class="navbar-wrapper">
                <span class="navbar-brand">{{ $route.name }}</span>
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
                            <i class="fas fa-chart-line fa-2x"></i>
                            <p class="d-lg-none d-md-block">Stats</p>
                        </a>
                    </li>

                    <notification-component></notification-component>

                    <li class="nav-item">
                        <a class="nav-link" href="javascript:void(0)">
                            <i class="fas fa-user fa-2x"></i>
                            <p class="d-lg-none d-md-block">Account</p>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

