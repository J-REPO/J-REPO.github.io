var gulp = require('gulp');
var pug = require('gulp-pug');
var plumber = require('gulp-plumber');
var notifier = require('node-notifier');
var data = require('gulp-data');
var fs = require('fs');

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
		return {data:json};
	}))
	.pipe(pug({pretty: true}))
	.pipe(gulp.dest('./'));
});

// 監視設定
gulp.task('watch',function(){
	gulp.watch(['./*/*.pug','./newui/**/*.pug','./*.pug','./json/*.json'],['pug']);
});

// 項目追加
gulp.task('default',['pug','watch']);
