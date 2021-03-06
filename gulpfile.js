var gulp 						= require('gulp');
var uglify 					= require('gulp-uglifyjs');
var concat					= require('gulp-concat');
var minifyCss 			= require('gulp-minify-css');
var minifyHtml 			= require('gulp-minify-html');
var rename 					= require("gulp-rename");
var templateCache 	= require('gulp-angular-templatecache');
var imgResize 			= require('gulp-image-resize');
var imgOptimize			= require('gulp-imagemin');
var rimraf 					= require('gulp-rimraf');
var addsrc 					= require('gulp-add-src');
var watch 					= require('gulp-watch');
var mocha 					= require("gulp-mocha");

var mkdirp 					= require('mkdirp');
var pngQuant 				= require('imagemin-pngquant');

// ** Uglify and Bundle all JS files
function uglifyCompressJS(){
	console.log(getCurrentTime() + 'Cache templates, Uglify and compressing JS');
	
	// DIST
	gulp.src('./templates/*.html')
	.pipe(templateCache({standalone: true}))
	.pipe(addsrc(['./app.js', './js/*.js']))
	.pipe(uglify({mangle: false}))
	.pipe(rename('app.min.js'))
	.pipe(gulp.dest('./public'));

	/*
	// DEV
	gulp.src('./templates/*.html')
	.pipe(templateCache({standalone: true}))
	.pipe(addsrc(['./app.js', './js/*.js']))
	.pipe(concat('app.min.js'))
	.pipe(gulp.dest('./public'));
	*/
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
	// -- Create folder tmp
	mkdirp('./public/img/tmp');

	// -- Resizing thread images
		gulp.src('./public/img/threads')
		.pipe(rimraf());

		gulp.src('./img/threads/*.*')
	    .pipe(imgResize({ 
	      width: 1000
	    }))
		.pipe(gulp.dest('./public/img/threads'));		


	// -- Resizing board images
		gulp.src('./public/img/boards/thumb')
		.pipe(rimraf());

		gulp.src('./img/boards/*.*')
	    .pipe(imgResize({ 
	      width: 1000
	    }))
		.pipe(gulp.dest('./public/img/boards/thumb'));

	// -- Resizing error images
		gulp.src('./public/img/error/*.*')
		.pipe(rimraf());

		gulp.src('./img/error/*')
		.pipe(gulp.dest('./public/img/error'));

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

	var hours = date.getHours() + "";
	var minutes = date.getMinutes() + "";
	var seconds = date.getSeconds() + "";
	
	// Padding '0'
	hours 	= (hours.length === 1) ? '0' + hours : hours;
	minutes = (minutes.length === 1) ? '0' + minutes : minutes;
	seconds = (seconds.length === 1) ? '0' + seconds : seconds;

	return '[' + hours 		+ ':'
					 	 + minutes 	+ ':'
					 	 + seconds	+ '] ';
}

// Tests

gulp.task("runTests", function() {
    return gulp.src("./test/*.js")
    .pipe(mocha());
});

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


