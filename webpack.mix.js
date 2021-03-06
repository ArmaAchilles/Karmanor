const mix = require('laravel-mix');
const webpack = require('webpack');

mix.webpackConfig({
    target: 'electron-renderer',
    node: {
        fs: 'empty',
        __dirname: false
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.VSCODE_DEBUG': JSON.stringify(process.env.VSCODE_DEBUG) || 'false'
        })
    ]
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
    .copy('src/fonts/fontawesome', 'build/webfonts', false)
    .copy('src/fonts', 'build/fonts', false)
    .setPublicPath('build');

if (! mix.inProduction()) {
    mix.webpackConfig({
        devtool: 'inline-source-map',
    });
}
