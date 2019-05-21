const { src, dest, watch, series } = require( 'gulp' )
    , sass         = require( 'gulp-sass' )
    , autoprefixer = require( 'gulp-autoprefixer' )
    , uglify       = require( 'gulp-uglify' )
    , concat       = require( 'gulp-concat' )
    , typescript   = require( 'gulp-typescript' )
    , babel        = require( 'gulp-babel' )
    , favicons     = require( 'gulp-favicons' )
    , webp         = require( 'gulp-webp' )
    , livereload   = require( 'gulp-livereload' )


const srcPath = {
    fonts     : 'source/fonts'     ,
    images    : 'source/images'    ,
    scripts   : 'source/scripts'   ,
    sass      : 'source/sass'      ,
    typescript: 'source/typescript',
    root      : 'source'
}

const destPath = {
    styles : 'html/design/styles' ,
    fonts  : 'html/design/fonts'  ,
    images : 'html/design/images' ,
    scripts: 'html/design/scripts',
    root   : 'html'
}


/**
 * Generate favicons for all devices.
 * @param {function} callback 
 */
function favico ( callback ) {
    const faviconsSettings = {
        appName: "PL App",
        appShortName: "PL App",
        appDescription: "This is an App created with pl-boilerplate",
        developerName: "César Mejía",
        developerURL: "http://cesarmejia.me/",
        background: "#020307",
        path: "/favicons",
        url: "http://cesarmejia.me/",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/?homescreen=1",
        version: 1.0,
        logging: false,
        html: `${ destPath }/index.html`,
        pipeHTML: true,
        replace: true,
        icons: {
            android: false,
            appleIcon: true,
            appleStartup: false,
            coast: false,
            favicons: true,
            firefox: false,
            opengraph: false,
            twitter: false,
            windows: false,
            yandex: false
        }
    }

    return src( `${ srcPath.root }/favicon.png` )
        .pipe( favicons( faviconsSettings ) )
        .pipe( dest(`${ destPath.root }/favicons`) )
}


/**
 * Copy fonts to production folder.
 * @param {function} callback 
 */
function fonts ( callback ) {
    const files = `${ srcPath.fonts }/*.{eot,woff,woff2,ttf,svg,otf}`

    return src( files )
        .pipe( dest( `${ destPath.fonts }` ) )
}


/**
 * Copy images to production folder.
 * @param {function} callback 
 */
function images ( callback ) {
    const files = `${ srcPath.images }/**.{jpg,jpeg,png,svg,webp}`

    return src( files )
        .pipe( dest( `${ destPath.images }` ) )
}


/**
 * Compiles sass files to generate production styles.
 * @param {function} callback 
 */
function styles ( callback ) {
    const sassSettings = {
        outputStyle: 'compressed'
    }

    const autoprefixerSettings = {
        browsers: [ 'last 2 versions' ],
        cascade: false
    }

    return src( `${ srcPath.sass }/styles.scss` )
        .pipe( sass( sassSettings ) )
        .pipe( autoprefixer( autoprefixerSettings ) )
        .pipe( dest( `${ destPath.styles }` ) )

}


/**
 * Compiles js files to generate production scripts.
 * @param {function} callback 
 */
function scripts ( callback ) {
    const babelSettings = {
        presets: [ '@babel/env' ]
    }

    return src( `${ srcPath.scripts }/scripts.js` )
        .pipe( babel( babelSettings ) )
        .pipe( uglify(  ) )
        .pipe( concat( `scripts.js` ) )
        .pipe( dest( `${ destPath.scripts }` ) )

}


/**
 * Compiles ts files to generate production scripts.
 * @param {function} callback 
 */
function ts ( callback ) {
    const files = [
        `${ srcPath.typescript }/*.ts`
    ];

    return src( files )
        .pipe( typescript() )
        .pipe( dest( `${ destPath.scripts }` ) )
}


/**
 * Handle watch event.
 * @param {function} callback 
 */
function watcher ( callback ) {
    const files = [
        `${ srcPath.fonts }/**/*.{otf,ttf,woff,svg}`,
        `${ srcPath.imgs }/**/*.{jpg,jpeg,svg,png}`,
        `${ srcPath.sass }/**/*.scss`,
        `${ srcPath.scripts }/**/*.js`
    ]

    livereload.listen()

    return watch( files, series( styles, scripts ) )
}


/**
 * Copy images to production folder.
 * @param {function} callback 
 */
function webpImages ( callback ) {
    const files = `${ srcPath.images }/**/*.{jpg,jpge,png,tiff,webp}`

    return src( `${ files }` )
        .pipe( webp(  ) )
        .pipe( `${ destPath.images }` )

}


exports.favico = favico
exports.fonts = fonts
exports.images = images
exports.styles = styles
// exports.scripts = scripts
exports.ts = ts
exports.watcher = watcher
exports.webpImages = webpImages

exports.build = series( favico, fonts, images, styles, ts )
