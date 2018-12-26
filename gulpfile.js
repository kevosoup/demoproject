'use strict';

// modules
var gulp = require('gulp'),
	gulpif = require('gulp-if'),
	runSequence = require('run-sequence'),
	fs = require('fs'),
	gulpconcat = require('gulp-concat'),
	watch = require('gulp-watch'),
	gutil = require('gulp-util'),
	sass = require('gulp-ruby-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	prefix = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(),
	exec = require('child_process').exec,
	stylemack = require('stylemack');
// var exec = require('child_process').exec;
// var replace = require('gulp-replace');
// var cssimport = require("gulp-cssimport");
// var uncss = require("gulp-uncss");

// configuration
var config = {
	dev: gutil.env.dev,
	src: {
		colors: {
			src: './src/scss/01-brand/colors.json',
			dist: './src/scss/01-brand/'
		},
		styles: {
			core: './src/scss/*.scss',
			dist: './src/assets/'
			// core: './src/**/*.scss'
		},
		fonts: {
			// src: './src/assets/fonts/**/*.{svg,eot,ttf,woff}',
			src: './src/assets/fonts/**/*',
			dist: '_dist/assets/fonts/'
		},
		html: {
			// src: './src/assets/fonts/**/*.{svg,eot,ttf,woff}',
			src: './src/*.html',
			dist: '_dist/'
		}
	},
	dest: '_dist'
};


// colors
// pulls JSON data and creates Sass color variables
gulp.task('colors', function() {

});


gulp.task('stylemack', function () {
	stylemack({
	    input: 'src/scss',
	    output: '_documentation',
	    configPath: '.stylemack.yml',
	});
})

// make CSS from Sass
gulp.task('sass', function () {
	return sass(config.src.styles.core, {
    	})
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(prefix('last 3 version'))
   		.pipe(gulpif((config.dev && !config.simple), sourcemaps.write('maps', {
	        includeContent: false,
	        sourceRoot: '.'
	    })))
   		// .pipe(gulpif(!config.dev, csso()))
   		// .pipe(gulpif(!config.dev, csscomb()))
        .pipe(gulp.dest('_dist/assets/styles'));
        // .pipe(gulpif(config.dev, reload({stream:true})));
});


gulp.task('sass:documentation', function () {
	return sass(config.src.styles.core, {
    	})
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(prefix('last 3 version'))
   		.pipe(gulpif((config.dev && !config.simple), sourcemaps.write('maps', {
	        includeContent: false,
	        sourceRoot: '.'
	    })))
   		// .pipe(gulpif(!config.dev, csso()))
   		// .pipe(gulpif(!config.dev, csscomb()))
        .pipe(gulp.dest('_documentation'));
        // .pipe(gulpif(config.dev, reload({stream:true})));
});


// fonts
gulp.task('fonts', function() {
	return gulp.src(config.src.fonts.src)
		.pipe(gulp.dest(config.src.fonts.dist + "/"));
});


// Static Server + watching scss/html files
gulp.task('serve', function() {
    browserSync.init({
        server: "./_dist"
    });

	gulp.watch("./src/assets/fonts/**/*", ['fonts']);

    gulp.watch("./src/scss/**/*.scss", ['sass']);
	gulp.watch("_dist/**/*.css").on('change', browserSync.reload);


    gulp.watch("./src/*.html", ['html']);
	gulp.watch("_dist/*.html").on('change', browserSync.reload);

});

gulp.task('html',function (){

	return gulp.src(config.src.html.src)
		.pipe(gulp.dest(config.src.html.dist + "/"));

})



// development build task
gulp.task('documentation', function () {
	// define build tasks
	var tasks = [
		'html',
		'stylemack',
		'fonts',
		'colors',
		'sass:documentation'
	];

	// run build
	runSequence(tasks, function () {
		// if (config.dev) {
			//gulp.start('serve');
		// }
		console.log("Built!");
	});
});



// default build task
gulp.task('default', function () {
	// define build tasks
	var tasks = [
		'html',
		'fonts',
		'colors',
		'sass',
		'documentation'
	];

	// run build
	runSequence(tasks, function () {
		// if (config.dev) {
			gulp.start('serve');
		// }
	});

});
