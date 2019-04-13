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

mix.ts('src/ts/main.ts', 'dist/js')
    .ts('src/ts/app.ts', 'dist/js')
    .sass('src/sass/app.scss', 'dist/css', {
        includePaths: ['node_modules']
    })
    .copy('src/html', 'dist/html', false)
    .copy('src/images', 'dist/images', false)
    .copy('src/fontawesome', 'dist/webfonts', false)
    .copy('src/fonts', 'dist/fonts', false)
    .setPublicPath('dist');
