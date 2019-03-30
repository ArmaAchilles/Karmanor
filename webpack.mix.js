const mix = require('laravel-mix');

mix.webpackConfig({
    target: 'electron-renderer',
    node: {
        fs: 'empty',
        __dirname: false
    }
});


mix.ts('app/src/ts/main.ts', 'app/dist/js')
    .ts('app/src/ts/app.ts', 'app/dist/js')
    .sass('app/src/sass/app.scss', 'app/dist/css', {
        includePaths: ['node_modules']
    })
    .copy('app/src/html', 'app/dist/html', false)
    .setPublicPath('app/dist');
