/*
 * Popups
*/
app.popups = {
	loaded: [],
	overlay: $('.popups-overlay'),
	bind() {
		let _this = this;

		// * Open popup
		$(document).on('click', '[data-popup]', function () {
			let id = $(this).attr('data-popup');
			if (!$(this).attr('data-popup-video')) {
				_this.open(id, {
					form: $(this).attr('data-popup-form') || '',
					ttl: $(this).attr('data-popup-header') || '',
					text: $(this).attr('data-popup-text') || '',
					btn: $(this).attr('data-popup-btn') || ''
				});
			} else {
				_this.video(id, {
					video: $(this).attr('data-popup-video')
				});
			}
		});

		// * Close popup clicking on cross
		$(document).on('click', '.popup__close, [data-popup-close]', function () {
			_this.close();
		});

		// * Close popup clicking outside popup
		$(document).on('click', '.popup', function (e) {
			if (!$(e.target).closest('.popup__content').length) {
				_this.close();
				e.stopPropagation();
			}
		});

		// * Close popup pressing ESC
		$(document).on('keyup', function (e) {
			if (e.key === 'Escape') {
				if (app.settings.popupOpened) {
					_this.close();
				}
			}
		});
	},

	// * Open popup
	open(id, opts) {
		let _this = this;

		if ($('#' + id).length) {
			$('.app').addClass('app--popup-opened');
			app.scrollLock();

			$('.popup').removeClass('active');
			let popup = $('.popup#' + id);

			if (popup.attr('data-overlay')) {
				_this.overlay.css('--overlay-color', popup.attr('data-overlay'));
			}

			if (id == 'request') {
				let ttl = opts?.ttl ? 
						opts.ttl : 
						'Оставить заявку',
					text = opts?.text ? 
						opts.text : 
						'Оставьте заявку, и&nbsp;наш специалист свяжется с&nbsp;вами в&nbsp;ближайшее время',
					btn = opts?.btn ? 
						opts.btn : 
						'Отправить';

				popup.find('.popup-head__title').html(ttl);
				popup.find('.popup-head__subtitle').html(text);
				popup.find('.ui-btn__text').html(btn);
			}

			popup.scrollTop(0).addClass('active');
			app.settings.popupOpened = true;
		}
	},

	// * Open video popup
	video(id, opts) {
		let _this = this;

		_this.open(id);

		if ($('#' + id).length && opts?.video) {
			let popup = $('.popup#' + id);
			popup
				.find('.popup__video')
					.html(`<iframe src="${opts.video}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`);
		}
	},

	// * Load popup content
	load(id, url) {
		let _this = this;

		if (!_this.loaded.includes(url)) {
			$('#' + id).find('.popup__load').load(url, function(response, status, xhr) {
				if (status == 'error') {
					$('#' + id).find('.popup__load').html(`Ошибка: ${xhr.status} ${xhr.xhr}`)
				}
			});

			_this.loaded.push(url);
		}

		_this.open(id);
	},

	// * Close popups
	close() {
		let _this = this;
		$('.popup').removeClass('active');
		$('.app').removeClass('app--popup-opened');
	
		setTimeout(function () {
			app.scrollLock('unlock');

			_this.overlay.css('--overlay-color', '');
		}, app.settings.animDuration);

		$('.popup__video').html('');
	
		$('.popup .ui-form').each(function () {
			app.forms.clear($(this));
		});
	
		app.settings.popupOpened = false;
	},

	// * TY popup
	thx(thx) {
		if (!thx) {
			thx = 'thx';
		}
		this.open(thx);
	
		$('.popup .ui-form').each(function () {
			app.forms.clear($(this));
		});
	},

	// * Init
	init(popup) {
		let mod = popup.attr('data-close') ? popup.attr('data-close') : '';
		popup.find('.popup__close-container')
			.prepend(`<div class="ui-crossbtn popup__close ${mod} noselect" />`);
	
		popup.data('popupsInit', true);
	}
}