const gulp = require('gulp');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const data = require('gulp-data');
const fs = require('fs');
const sass = require('gulp-sass');
const run = require('gulp-run');
const connect = require("gulp-connect");

// pugタスク設定
gulp.task('pug', function () {
	taskname = this.seq.slice(-1)[0];
	gulp.src(['www/pug/*.pug', 'www/pug/en/*.pug'], { base: 'www/pug/' })
		.pipe(plumber({
			errorHandler: function (error) {
				var title = '[task]' + taskname + ' ' + error.plugin;
				var errorMsg = 'error: ' + error.message;
				console.error(title + '\n' + errorMsg);
			}
		}))
		.pipe(data(function (file) {
			var dirname = "./www/json/";
			var files = fs.readdirSync(dirname);
			var json = {};
			files.forEach(function (filename) {
				json[filename.replace(".json", "")] = JSON.parse(fs.readFileSync(dirname + filename));
			});
			return { data: json, require: require };
		}))
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest('dest/'))
		.pipe(connect.reload());
});

gulp.task('article', function () {
	return run('node www/tools/article-generator.js').exec()
})

gulp.task('sass', function () {
	return gulp.src(['./www/scss/**/*.scss', './www/scss/*.scss'], { base: './www/scss/' })
		.pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
		.pipe(gulp.dest('dest/public/css'))
		.pipe(connect.reload());
});

gulp.task('copy', function () {
	return gulp.src(['www/favicons/**/*.**', 'www/fonts/**/*.**', 'www/img/**/*.**','www/js/**/*.**'], { base: 'www/' })
		.pipe(gulp.dest('dest/public'))
});

// 監視設定
gulp.task('watch', function () {
	gulp.watch(['./!(node_modules)/**/{*,**/*}.pug', '*.pug', './json/*.json'], ['pug']);
	gulp.watch(['./public/scss/**/*.scss'], ['sass']);
	gulp.watch(['./www/markdown/**/*.md'], ['article']);
});

gulp.task('connect', function () {
	connect.server({
		root: "dest",
		livereload: true,
		port: 9000
	})
})

gulp.task('build', ['pug', 'sass', 'article', 'copy'])

// 項目追加
gulp.task('default', ['build', 'watch','connect']);
