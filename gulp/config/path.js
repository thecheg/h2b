import * as nodePath from 'path';
const root = nodePath.basename(nodePath.resolve());

const build = nodePath.basename(nodePath.resolve());
const src = './#src';

//const fs = require('fs');
const pConfig = '';

export const path = {
	build: {
		html: `${build}/`,
		tpl: `${build}/template/`,
		css: `${build}/css/`,
		js: `${build}/js/`,
		img: `${build}/images/`,
		fonts: `${build}/fonts/`,
		files: `${build}/files/`,
		timestamp: `${build}/`
	},
	src: {
		html: [
			`${src}/**/*.{php,html,htaccess,json}`,
			`!${src}/template/**/*.*`
		],
		scss: [
			`${src}/scss/**.scss`,
		],
		libs: `${src}/js/plugins.js`,
		js: [
			`${src}/js/app.js`,
		],
		imgMin: [
			src + '/images/**/*.{jpg,png,svg,gif,ico,webp}',
			'!' + src + '/images/favicon/*.*',
			'!' + src + '/images/**/__*'
		],
		imgWebp: [
			src + '/images/**/*.{jpg,png,gif}',
			'!' + src + '/images/favicon/*.*',
			'!' + src + '/images/**/__*'
		],
		imgCopy: [
			`${src}/images/**/__*`
		],
		fonts: `${src}/fonts/*.ttf`,
		fav: `${src}/images/favicon/*`,
		files: [
			`${src}/files/**/*.*`,
		],
		timestamp: `${src}/data/timestamp.txt`,
	},
	watch: {
		html: [
			`${src}/**/*.{php,html,htaccess,json}`
		],
		scss: [
			`${src}/scss/**/*.scss`,
			`${src}/modules/**/*.scss`
		],
		libs: `${src}/js/plugins.js`,
		js: [
			`${src}/js/**/*.js`,
			`${src}/modules/**/*.js`
		],
		img: `${src}/images/**/*.{jpg,png,svg,gif,ico,webp}`,
		fav: `${src}/images/favicon/*`,
		files: `${src}/files/**/*.*`
	},
	clean: build,
	buildFolder: build,
	srcFolder: src,
	rootFolder: root,
	copy: ''
}