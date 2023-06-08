//import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';
import webp from 'imagemin-webp';
import pngquant from 'imagemin-pngquant';
import mozjpeg from 'imagemin-mozjpeg';
import svgo from 'imagemin-svgo';

export const images = () => {
	let task = app.gulp.src(app.path.src.imgCopy)
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'IMAGES',
				message: 'Error <%= error.message %>'
			})
		))
		.pipe(app.plugins.newer(app.path.build.img))
		.pipe(app.gulp.dest(app.path.build.img))

		.pipe(app.gulp.src(app.path.src.imgWebp))
		.pipe(app.plugins.newer(app.path.build.img))
		.pipe(
			imagemin([
				webp({
					quality: 95
				})
			])
		)
		.pipe(
			app.plugins.rename({
				extname: '.webp'
			})
		)
		.pipe(app.gulp.dest(app.path.build.img))

		.pipe(app.gulp.src(app.path.src.imgMin))
		.pipe(app.plugins.newer(app.path.build.img))
		.pipe(
			imagemin([
				pngquant({
					quality: [0.9, 0.95]
				}),
				mozjpeg({
					quality: 95,
					progressive: true
				}),
				svgo({
					plugins: [
						{
							name: 'removeViewBox',
							active: true
						},
						{
							name: 'cleanupIDs',
							active: false
						}
					]
				})
			])
		)
		.pipe(app.gulp.dest(app.path.build.img));
		return task.pipe(app.plugins.browsersync.stream());
}