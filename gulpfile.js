var gulp = require('gulp');
var haml = require('gulp-ruby-haml');
var plumber = require('gulp-plumber');
var notifier = require('node-notifier');

// hamlタスク設定
gulp.task('haml', function() {
	taskname = this.seq.slice(-1)[0]
	gulp.src('./*.haml')
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
	.pipe(haml({encodings: "UTF-8"}))
	.pipe(gulp.dest('./'));
});

// 監視設定
gulp.task('watch',function(){
	gulp.watch('./**/*.haml',['haml']);
});

// 項目追加
gulp.task('default',['haml','watch']);
