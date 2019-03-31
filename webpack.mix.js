const mix = require('laravel-mix');

mix.webpackConfig({
    target: 'electron-renderer',
    node: {
        fs: 'empty',
        __dirname: false
    }
});

mix.options({
    processCssUrls: false
});

mix.ts('app/src/ts/main.ts', 'app/dist/js')
    .ts('app/src/ts/app.ts', 'app/dist/js')
    .sass('app/src/sass/app.scss', 'app/dist/css', {
        includePaths: ['node_modules']
    })
    .copy('app/src/html', 'app/dist/html', false)
    .copy('app/src/images', 'app/dist/images', false)
    .copy('app/src/fontawesome', 'app/dist/webfonts', false)
    .copy('app/src/fonts', 'app/dist/fonts', false)
    .setPublicPath('app/dist');
