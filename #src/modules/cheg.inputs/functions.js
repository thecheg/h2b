/*
* Floating placeholder
*/
app.inputs = (label) => {
	let input = label.find('input, textarea'),
		field = label.closest('.ui-form__field');

	// * focus on input
	input.on('focus', function () {
		label.addClass('active focused');
	}).on('focusout blur change keyup input', function () {
		let value = $(this).val();
		if (value === '') {
			if (!input.is(':focus')) {
				label.removeClass('active');
			}
		} else {
			label.addClass('active');
			field.removeClass('ui-form__field--error');
		}
	}).on('focusout', function () {
		label.removeClass('focused');
	});

	input.trigger('change');

	label.data('inputInit', true);
}