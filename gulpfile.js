var gulp = require('gulp');
var pug = require('gulp-pug');
var plumber = require('gulp-plumber');
var notifier = require('node-notifier');

// hamlタスク設定
gulp.task('pug', function() {
	taskname = this.seq.slice(-1)[0]
	gulp.src(['./*/*.pug','./*.pug'],{base:'./'})
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
	.pipe(pug({pretty: true}))
	.pipe(gulp.dest('./'));
});

// 監視設定
gulp.task('watch',function(){
	gulp.watch(['./*/*.pug','./*.pug'],['pug']);
});

// 項目追加
gulp.task('default',['pug','watch']);
