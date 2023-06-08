/*
 * Scroll lock
*/
app.scrollLock = (type) => {
	if (type == 'unlock') { // * unlock
		app.deviceIs.ios ? $(window).scrollTop(app.settings.scrollLockPos) : null;

		$('.app').removeClass('app--fixed');
	} else { // * lock
		app.settings.scrollLockPos = $(window).scrollTop();

		$('.app').addClass('app--fixed');
	}
}