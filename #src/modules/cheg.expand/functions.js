/*
 * Expandable blocks
*/
app.expand = (ex) => {
	let pref = 'ui-expand',
		hidd = ex.find('.' + pref + '__hidden'),
		trig = ex.find('.' + pref + '__trigger'),
		trigText = trig.find('.' + pref + '__trigger-text'),
		closedText = trig.attr('data-closed-text'),
		openedText = trig.attr('data-opened-text');

	trigText.text(closedText);

	trig.on('click', function () {
		if (!ex.hasClass('active')) {
			ex.addClass('active');
			hidd.slideDown(400);
			trigText.text(openedText);
		} else {
			ex.removeClass('active');
			hidd.slideUp(400);
			trigText.text(closedText);
		}
	});

	ex.data('expandInit', true);
}