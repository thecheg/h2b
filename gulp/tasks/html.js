import version from 'gulp-version-number';

let pConfig = {};

export const html = () => {
	pConfig = JSON.parse(app.plugins.fs.readFileSync('gulp/config/config.json'));

	let task = app.gulp.src(app.path.src.html)
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'HTML',
				message: 'Error <%= error.message %>'
			})
		))
		.pipe(app.plugins.fileinclude())

	Object.keys(pConfig).forEach((key) => {
		task = task.pipe(app.plugins.replace(`{{${key}}}`, pConfig[key]));
	});

	return task
		//.pipe(app.plugins.replace(/@images\//g, 'images/'))
		.pipe(version({
			'value': '%DT%',
			'append': {
				'key': 't',
				'cover' : 0,
				'to': [
					'css',
					'js'
				]
			},
			'output': {
				'file': 'gulp/version.json'
			}
		}))
		.pipe(app.gulp.dest(app.path.build.html))
		.pipe(app.plugins.browsersync.stream());
}