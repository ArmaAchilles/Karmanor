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

mix.ts('src/ts/main.ts', 'build/js')
    .ts('src/ts/app.ts', 'build/js')
    .sass('src/sass/app.scss', 'build/css', {
        includePaths: ['node_modules']
    })
    .copy('src/html', 'build/html', false)
    .copy('src/images', 'build/images', false)
    .copy('src/fontawesome', 'build/webfonts', false)
    .copy('src/fonts', 'build/fonts', false)
    .setPublicPath('build');
