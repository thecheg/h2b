/*
 * Units
*/
app.units = {
	vh() {
		$('body').append('<div class="vh-fix" style="position:fixed;width:1px;left:-9999px;top:0;bottom:0;pointer-events:none;opacity:0;visibility:hidden;" />');

		let vh = $('.vh-fix').height() * 0.01;
		$('html').css('--vh', vh + 'px');

		$('.vh-fix').remove();
	},
	contW() {
		let contW = $('.container').not('.container--off').first().width();
		$('html').css('--cont-w-a', contW + 'px');

		$('.container--off').each(function() {
			let w = $(this).width();

			$(this).css('--cont-w-a', w + 'px');
		});
	},
	contOff() {
		let contOff = ($(window).width() - $('.container').not('.container--off').first().width()) / 2;
		$('html').css('--cont-off', contOff + 'px');

		$('.container--off').each(function() {
			let off = ($(window).width() - $(this).width()) / 2;

			$(this).css('--cont-off', off + 'px');
		});
	},
	sb() {
		let div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>');
		$('body').append(div);
		let w1 = $('div', div).innerWidth();
		div.css('overflow-y', 'scroll');
		let w2 = $('div', div).innerWidth();
		$(div).remove();

		let bodyHeight = parseInt($('.app').height());

		if (bodyHeight > app.settings.winHeight) {
			app.settings.sbWidth = w1 - w2;
		} else {
			app.settings.sbWidth = 0;
		}

		$('html').css('--sbW', app.settings.sbWidth + 'px');
	},
	all() {
		this.vh();
		this.mobile();
	},
	mobile() {
		this.contW();
		this.contOff();
		this.sb();
	}
}