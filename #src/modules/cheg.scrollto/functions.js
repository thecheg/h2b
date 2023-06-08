/*
 * Scroll to element
*/
app.scrollTo = (id, options) => {
	if ($(id).length) {
		options = $.extend({
			offset: 0,
			speed: 1000
		}, options);

		let scrollPos = $(id).offset().top - options.offset;

		$('html, body').animate({
			scrollTop: scrollPos
		}, options.speed);
	}
}