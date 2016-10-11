var gulp = require('gulp');
var pug = require('gulp-pug');
var plumber = require('gulp-plumber');
var notifier = require('node-notifier');
var data = require('gulp-data');
var fs = require('fs');
var sass = require('gulp-sass');

// hamlタスク設定
gulp.task('pug', function() {
	taskname = this.seq.slice(-1)[0];
	gulp.src(['./*.pug','./en/*.pug','./newui/*.pug'],{base:'./'})
	.pipe(plumber({
		errorHandler: function(error) {
			var title = '[task]' + taskname + ' ' + error.plugin;
			var errorMsg = 'error: ' + error.message;
			console.error(title + '\n' + errorMsg);
			notifier.notify({
				title: title,
				message: errorMsg,
				time: 3000
			});
		}
	}))
	.pipe(data(function(file){
		var dirname = "./json/";
		var files = fs.readdirSync(dirname);
		var json = {};
		files.forEach(function(filename){
			json[filename.replace(".json","")] = JSON.parse(fs.readFileSync(dirname + filename));
		});
		return {data:json,require:require};
	}))
	.pipe(pug({pretty: true}))
	.pipe(gulp.dest('./'));
});

gulp.task('sass',function() {
	return gulp.src(['./public/scss/**/*.scss','./public/scss/*.scss'],{base:'./public/scss/'})
			.pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
			.pipe(gulp.dest('./public/css/'))
});

// 監視設定
gulp.task('watch',function(){
	gulp.watch(['./!(node_modules)/**/{*,**/*}.pug','*.pug','./json/*.json'],['pug']);
	gulp.watch(['./public/scss/**/*.scss'],['sass']);
});

// 項目追加
gulp.task('default',['pug','watch']);
