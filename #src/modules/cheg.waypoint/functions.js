/*
 * Waypoints
 */
app.waypoint = (opts) => {
	let _this = this,
		position = 0;

	opts = $.extend({
		position: 0,
		onDown: function() {},
		onUp: function() {}
	}, opts);

	$(window).on('resize',function() {
		if (typeof opts.position == 'function') {
			position = opts.position.call();
		} else {
			position = opts.position;
		}
	})
	.on('resize scroll',function() {
		if ($(window).scrollTop() > position) {
			if (typeof opts.onDown == 'function') {
				opts.onDown.call();
			}
		} else {
			if (typeof opts.onUp == 'function') {
				opts.onUp.call();
			}
		}
	})
	.trigger('resize').trigger('scroll');
}