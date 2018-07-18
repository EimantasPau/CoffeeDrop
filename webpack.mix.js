const mix = require('laravel-mix');


mix.options({
    publicPath: 'dist'
});
mix.setResourceRoot('../');
mix.sass('src/scss/style.scss', 'css')
    .js('src/js/app.js', 'js');