export const favicon = () => {
	return app.gulp.src(app.path.src.fav)
		.pipe(app.gulp.dest(app.path.build.img + 'favicon/'));
}