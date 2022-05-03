const dotenv = require('dotenv')
dotenv.config()

const gulp = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')(require('sass'))
const cssmin = require('gulp-cssmin')
const jsImport = require('gulp-js-import')
const clean = require('gulp-clean')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const changed = require('gulp-changed')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const htmlPartial = require('gulp-html-partial')
const gulpIf = require('gulp-if')
const htmlmin = require('gulp-htmlmin')
const isProd = process.env.NODE_ENV === 'prod'

const htmlFile = [ 'src/*.html' ]

function html(){
    return gulp.src(htmlFile)
    .pipe(htmlPartial({
        basePath: './src/partials'
    }))
    .pipe(gulpIf(isProd, htmlmin({
        collapseWhitespace: true
    })))
    .pipe(gulp.dest('dist'))
}


function style(){
    return gulp.src('./src/sass/**/*.scss')  
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(sass({ includePaths:['node_modules'] })).on('error', sass.logError)
    .pipe(gulpIf(!isProd, sourcemaps.write()))
    .pipe(gulpIf(isProd,  cssmin() )) 
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream())
}

//compile javascript into bundle
function javascript(){
    gulp.src('./src/**/*.js')
    .pipe(jsImport({
        hideConsole: true
    }))
    //.pipe(concat('app.js'))
    .pipe(gulpIf(isProd, uglify()))
    .pipe(gulp.dest('dist'));
}

function img(){
    return gulp.src('./src/img/*')
    .pipe(gulpIf(isProd,imagemin() ))
    .pipe(gulp.dest('dist/img/'));
}

function serve(){
    browserSync.init({
        open: true,
        server: './dist'
    });
}

function browserSyncReload(done){
    browserSync.reload();
    done();
}

function watch(){
    gulp.watch('./src/**/*.html', gulp.series(html, browserSyncReload))
    gulp.watch('./src/**/*.scss', gulp.series(style, browserSyncReload))
    gulp.watch('./src/**/*.js', gulp.series(javascript, browserSyncReload))
    gulp.watch('./src/img/**/*.*', gulp.series(img))
}

function del(){
    return gulp.src('dist/*', {read:false})
    .pipe(clean());
}

exports.html = html;
exports.style = style;
exports.javascript = javascript;
exports.del = del;
exports.serve = gulp.parallel(html, style, javascript, img, watch, serve)
exports.default = gulp.series(del, html, style, javascript, img);