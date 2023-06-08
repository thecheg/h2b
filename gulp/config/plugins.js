import replace from 'gulp-replace'; // поиск и замена
import plumber from 'gulp-plumber'; // обработка ошибок
import notify from 'gulp-notify'; // сообщения
import browsersync from 'browser-sync'; // обновление браузера
import newer from 'gulp-newer'; // проверка новизны файла
import rename from 'gulp-rename'; // переименовывание файлов
import fs from 'fs'; // работа с файлами
import fileinclude from 'gulp-file-include'; // подключение файлов
import include from 'gulp-include'; // подключение файлов
import terser from 'gulp-terser'; // минифицирование файлов
import beautify from 'gulp-beautify'; // форматирование кода

export const plugins = {
	replace: replace,
	plumber: plumber,
	notify: notify,
	browsersync: browsersync,
	newer: newer,
	rename: rename,
	fs: fs,
	fileinclude: fileinclude,
	terser : terser,
	include : include,
	beautify : beautify
}