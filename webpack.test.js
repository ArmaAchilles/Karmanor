const mix = require('laravel-mix');

mix.ts('test/src/*.test.ts', 'test/build')
    .setPublicPath('test');

mix.webpackConfig({
    devtool: 'inline-source-map',
});
