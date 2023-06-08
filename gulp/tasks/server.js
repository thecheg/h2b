export const server = (done) => {
	app.plugins.browsersync.init({
		proxy: app.path.buildFolder + '/index.html',
		notify: false
	});
}