<template>
    <div class="container py-3">
        <div class="row">
            <div class="card mx-auto">
                <div class="card-header">
                    <h2>Karmanor</h2>
                </div>

                <div class="card-body">
                    <span>An Electron app which builds source code from ArmA 3 PBOs and runs the game with the built PBOs and runs testing functionality.</span>

                    <div v-show="responseData.length">
                        <ul>
                            <li v-for="(data, key) in responseData" :key="key">
                                I've got some data, {{ data }}!
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="card-footer">
                    <button class="btn btn-primary" :disabled="serverStarted" @click="startServer()">Start Server</button>
                    <button class="btn btn-outline-danger" :disabled="!serverStarted" @click="stopServer()">Stop Server</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as http from 'http';

    export default {
        name: 'home',

        data() {
            return {
                serverStarted: false,
                server: {},
                responseData: []
            }
        },

        methods: {
            startServer() {
                let postedData;

                let server = http.createServer((request, response) => {
                    request.on('data', data => {
                        console.dir(data);

                        postedData += data;
                    });

                    request.on('end', () => {
                        console.log(postedData);

                        response.writeHead(200, {'Content-Type': 'text/html'});
                        response.end();
                    });
                }).listen(8080);

                server.on('listening', () => {
                    this.serverStarted = true;
                    flash('Server started!');
                });

                server.on('connection', () => {
                    console.log('I hear someone!');
                });

                server.on('close', () => {
                    this.serverStarted = false;
                    flash('Server stopped!');
                });

                this.server = server;
            },

            stopServer() {
                this.server.close();
            }
        }
    }
</script>
