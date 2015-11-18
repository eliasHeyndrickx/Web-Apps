var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var rename = require("gulp-rename");
var templateCache = require('gulp-angular-templatecache');
var imageResize = require('gulp-image-resize');
var rimraf = require('gulp-rimraf');
var addsrc = require('gulp-add-src');
var watch = require('gulp-watch');

// ** Uglify and Bundle all JS files
function uglifyCompressJS(){
	console.log(getCurrentTime() + 'Cache templates, Uglify and compressing JS');
	gulp.src('./templates/*.html')
	.pipe(templateCache({standalone: true}))
	.pipe(addsrc(['./app.js', './js/*.js']))
	.pipe(uglify({mangle: false}))
	.pipe(rename('app.min.js'))
	.pipe(gulp.dest('./public'));
}

// ** Uglify server JS
function uglifyServerJS(){
	console.log(getCurrentTime() + 'Uglifiy Server JS...');
	gulp.src('./server.js') 
		.pipe(uglify())
		.pipe(rename('server.min.js'))
		.pipe(gulp.dest('./'));
}

// ** Compress HTML Index
function compressHtmlIndex(){
	console.log(getCurrentTime() + 'Compress Html Index...');
	gulp.src('./index.html')
		.pipe(minifyHtml())
		.pipe(gulp.dest('./public/'));
}

// ** Update board update board images
function resizeImages(){
	console.log(getCurrentTime() + 'Resizing Images...');
	// -- Resizing thread images
		gulp.src('./public/img/threads')
		.pipe(rimraf());

		gulp.src('./img/threads/*.jpg')
	    .pipe(imageResize({ 
	      width : 500
	    }))
		.pipe(gulp.dest('./public/img/threads'));		


	// -- Resizing board images
		gulp.src('./public/img/boards/thumb')
		.pipe(rimraf());

		gulp.src('./img/boards/*.jpg')
	    .pipe(imageResize({ 
	      width : 500
	    }))
		.pipe(gulp.dest('./public/img/boards/thumb'));
}

// ** Minify CSS
function minifyCssMain(){
	console.log(getCurrentTime() + 'Minify Css Main...');
	gulp.src('./css/main.css')
		.pipe(minifyCss())
		.pipe(gulp.dest('./public/css/'));
}

// ** Append Current Time
function getCurrentTime(){
	var date = new Date();
	return "[" + date.getHours()		+ ":"
					 	 + date.getMinutes()	+ ":"
					 	 + date.getSeconds()	+ "] ";
}

// Watch files for changes
gulp.task('default', function(){
	uglifyServerJS();
	resizeImages();
	uglifyCompressJS();
	compressHtmlIndex();
	minifyCssMain();

	watch(['./app.js', './js/*.js', './templates/*.html'], uglifyCompressJS);
	watch('./img/**/*.jpg', resizeImages);
	watch('./server.js', uglifyServerJS);
	watch('./index.html', compressHtmlIndex);
	watch('./css/main.css', minifyCssMain);
});


