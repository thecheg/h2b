import dartSass from 'sass';
import gulpSass from 'gulp-sass';

import cleanCss from 'gulp-clean-css';
import webpcss from 'gulp-webpcss';
import autoprefixer from 'gulp-autoprefixer';
import groupCssMedia from 'gulp-group-css-media-queries';

const sass = gulpSass(dartSass);

export const scss = () => {
	return app.gulp.src(app.path.src.scss, {sourcemaps: true})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'SCSS',
				message: 'Error <%= error.message %>'
			})
		))
		//.pipe(app.plugins.replace(/@images\//g, '../images/'))
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(groupCssMedia())
		.pipe(webpcss(
			{
				webpClass: '._webp',
				noWebpClass: '._no-webp'
			}
		))
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserslist: ['last 3 versions'],
			cascade: false
		}))
		.pipe(app.plugins.beautify.css({
			indent_with_tabs: true,
			indent_size:1
		}))
		.pipe(app.gulp.dest(app.path.build.css))
		.pipe(cleanCss())
		.pipe(app.plugins.rename({
			extname: '.min.css'
		}))
		.pipe(app.gulp.dest(app.path.build.css))
		.pipe(app.plugins.browsersync.stream());
}