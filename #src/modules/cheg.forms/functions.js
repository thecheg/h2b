/*
 * Forms - validate, send, clear
*/
app.forms = {
	sel: {
		field: 'ui-form__field',
		fieldReq: '--required',
		fieldEr: '--error',
		errors: 'ui-errors',
		errorsItem: '__item',
		errorsType: '--type',
		errorsReq: '--required',
	},
	types: {
		email: {
			reg: /^([a-z0-9_\.-])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/i,
			text: 'Некорректный e-mail'
		},
		phone: {
			reg: /^(\+)?(\d{1,2})?[( .-]*(\d{1,3})[) .-]*(\d{1,4})[ .-]?(\d{1,4})$/,
			text: 'Некорректный номер телефона'
		}
	},
	init(form) {
		let _this = this;

		// add errors to fields
		form.find('.'+_this.sel.field+_this.sel.fieldReq).each(function () {
			$(this).append(`<div class="${_this.sel.errors}">
				<p class="${_this.sel.errors+_this.sel.errorsItem} ${_this.sel.errors+_this.sel.errorsItem+_this.sel.errorsReq}">
					Обязательное поле
				</p>
			</div>`);
		});
	
		// add * to required fields
		form.find('.'+_this.sel.field+_this.sel.fieldReq).each(function () {
			if ($(this).find('.ui-input__placeholder').length) {
				$(this).find('.ui-input__placeholder').append(' *');
			} else {
				$(this).find('input, textarea').each(function() {
					$(this).attr('placeholder', $(this).attr('placeholder') + ' *');
				});
			}
		});
	
		// check if is filled
		form.on('submit', function (e) {
			e.preventDefault();
	
			let formType = form.attr('data-form-type'),
				valid = _this.validate(form);
	
			// if check passed
			if (valid) {
				let formData = new FormData(form.get(0)),
					thxPopup = form.attr('data-form-thxpopup') || 'thx',
					sender = form.attr('action');

				if (!app.settings.formTitle || app.settings.formTitle == '') {
					app.settings.formTitle = 'Заявка';
				}
				formData.append('formTitle', app.settings.formTitle);
				formData.append('formType', formType);

				console.log(formData);
				
				$.ajax({
					type: 'POST',
					url: sender,
					dataType: 'json',
					processData: false,
					contentType: false,
					data: formData,
					success: function () {
						app.popups.thx(thxPopup);
						_this.clear(form);
					},
					error: function (data) {
						console.log(data);
					}
				});
			}
			// if not passed
			else {
				form.find('.'+_this.sel.field+_this.sel.fieldEr).first().find('input, textarea').focus();
			}
		});
	
		form.data('formInit', true);
	},
	clear(form) {
		let _this = this;

		form
			.find('.'+_this.sel.field)
				.removeClass(_this.sel.field+_this.sel.fieldEr)
			.find('input, textarea')
				.val('')
				.trigger('change');
	},
	validate(form) {
		let _this = this,
			fields = form.find('.'+_this.sel.field+_this.sel.fieldReq),
			valid = true;

		if (fields.length) {
			fields.each(function () {
				let field = $(this),
					fieldType = field.attr('data-field-type'),
					fieldVal;

				if (field.find('input').length) {
					fieldVal = field.find('input').val();
				} else {
					fieldVal = field.find('textarea').val();
				}

				field.find(_this.sel.errors+_this.sel.errorsItem+_this.sel.errorsType).remove();

				if (!fieldVal) {
					field.addClass(_this.sel.field+_this.sel.fieldEr);
					field.find('.'+_this.sel.errors+_this.sel.errorsItem+_this.sel.errorsType).remove();
					field.find('.'+_this.sel.errors+_this.sel.errorsItem+_this.sel.errorsReq).show();
					valid = false;
				} else {
					field.removeClass(_this.sel.field+_this.sel.fieldEr);
					field.find('.'+_this.sel.errors+_this.sel.errorsItem+_this.sel.errorsReq).hide();

					if (fieldType in _this.types) {
						if (!_this.types[fieldType].reg.test(fieldVal)) {
							field
								.addClass(_this.sel.field+_this.sel.fieldEr)
								.find('.'+_this.sel.errors)
									.append(`<p class="${_this.sel.errors+_this.sel.errorsItem+_this.sel.errorsType}">${_this.types[fieldType].text}</p>`);
									
							valid = false;
						} else {
							field
								.removeClass(_this.sel.field+_this.sel.fieldEr)
								.find('.'+_this.sel.errors+_this.sel.errorsItem+_this.sel.errorsType)
									.remove();
						}
					}
				}
			});
		}

		return valid;
	}
}