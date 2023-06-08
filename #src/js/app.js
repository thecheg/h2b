'use strict';

//=include ../../node_modules/jquery/dist/jquery.js
//=include ../../node_modules/device.js/dist/device.umd.js

//=include ../../node_modules/swiper/swiper-bundle.js
//=include ../../node_modules/jquery-form-styler/dist/jquery.formstyler.js

/*
 * Cheg UI 3.0.0
*/
const app = {
	settings: {
		winWidth: 0,
		winHeight: 0,

		sbWidth: 0,

		scrollOffset: function() {
			return $('.header').outerHeight();
		},
		scrollPos: 0,
		popupOpened: false,
		scrollLockPos: 0,

		animDuration: 400,

		appLoaded: false,

		formTitle: '',

		menuOpened: false,
	},
	deviceIs: device.device,

	detectBrowser() {
		let userAgent = navigator.userAgent,
			browserName;

		if (userAgent.match(/chrome|chromium|crios/i)) {
		  browserName = "chrome";
		} else if (userAgent.match(/firefox|fxios/i)) {
		  browserName = "firefox";
		} else if (userAgent.match(/safari/i)) {
		  browserName = "safari";
		} else if (userAgent.match(/opr\//i)) {
		  browserName = "opera";
		} else if (userAgent.match(/edg/i)) {
		  browserName = "edge";
		} else if (userAgent.match(/android/i)) {
		  browserName = "android";
		} else if (userAgent.match(/iphone/i)) {
		  browserName = "iphone";
		} else {
		  browserName = "Unknown";
		}

		$('html').addClass('browser-' + browserName);
	},

	/*
	 * Checking if matches media query
	*/
	matches(query) {
		return window.matchMedia(`(${query})`).matches
	},

	/*
	 * Scroll to hash on page laod
	*/
	toHash() {
		if (window.location.hash) {
			app.scrollTo(window.location.hash, {
				offset: app.settings.scrollOffset()
			});
		}
	},

	/*
	 * Form styler
	*/
	styler: {
		classes: {
			select: {
				single: {
					'jq-selectbox': 'ui-select__inner',
					'jq-selectbox__select': 'ui-select__head',
					'jq-selectbox__select-text': 'ui-select__text',
					'jq-selectbox__trigger': 'ui-select__trigger',
					'jq-selectbox__trigger-arrow': 'ui-select__icon',
					'jq-selectbox__dropdown': 'ui-select__popup',
				}
			}
		},
		select(block) {
			let _this = this,
				sel = block.find('select');

			if (sel.attr('multiple')) {
				sel.styler({
					onFormStyled: () => {
						block.find('.jq-select-multiple ul').addClass('ui-select__mult-pop');

						block.find('.jq-select-multiple').addClass('ui-select__mult hide');

						block.find('.ui-select__mult-pop li').each(function() {
							$(this).html(`
								<span class="ui-select__mult-pop-text">${$(this).html().trim()}</span>
							`);
							$(this).prepend(`
								<span class="ui-select__mult-pop-icon"></span>
							`);
						});
					},
				});

				block.append(`
					<div class="ui-select__head">
						<div class="ui-select__text">
							${sel.attr('data-placeholder')}
						</div>
						<div class="ui-select__trigger"><div class="ui-select__icon"></div></div>
					</div>
				`);
				let head = block.find('.ui-select__head');
				
				if (!app.deviceIs.mobile && !app.deviceIs.tablet) {
					head.on('click', function() {
						block.find('.ui-select__mult').toggleClass('hide');
					});

					$(document).on('click', function (e) {
						if (!$(e.target).closest('.ui-select').length) {
							block.find('.ui-select__mult').addClass('hide');
						}
					});
				} else {
					head.on('click', function() {
						sel.trigger('focus');
					});
				}
			} else {
				sel.styler({
					onFormStyled: () => {
						for (var sel in _this.classes.select.single) {
							block.find('.'+sel).addClass(_this.classes.select.single[sel]);
						}
					},
					onSelectOpened: function() {
						$(this).css('z-index', 99);
					},
					onSelectClosed: function() {
						$(this).css('z-index', 1);
					}
				});
			}

			sel.data('selectInit', true);
		}
	},

	/*
	 * Search
	*/
	search: {
		init(block) {
			let _this = this,
				inp = block.find('.search__line-inp input'),
				clear = block.find('.search__line-clear');

			inp.on('change keyup paste', function() {
				let val = $(this).val();

				if (val && val !== '') {
					block.addClass('filled');
				} else {
					block.removeClass('filled');
				}
			});

			clear.on('click', function() {
				inp.val('').trigger('change').trigger('focus');
			});

			inp.trigger('change');
			
			block.data('searchInit', true);
		}
	},

	/*
	 * Wall
	*/
	wall(block) {
		$(window).on('resize', function() {
			let cols = block.find('.wall__col'),
				height = 0;
				
			block.addClass('sizing');
			cols.each(function() {
				let height1 = $(this).outerHeight();

				if (height1 > height) {
					height = height1;
				}
			});

			block.removeClass('sizing')
				.css('--wall-height', height.toFixed(0) + 'px');
		});

		block.data('wallInit', true);
	},

	/*
	 * Carousel
	*/
	carousel(block) {
		let slider = block.find('.ui-carousel__slider'),
			sliderS,
			opts = JSON.parse(block.attr('data-carousel')) || {},
			swiperOpts = $.extend({
				slidesPerView: 'auto',
				spaceBetween: 20,
				speed: 500,
				loop: false,
				grabCursor: true,
				init: true,
				navigation: {
					nextEl: block.find('.ui-carousel__nav-item--n').get(0),
					prevEl: block.find('.ui-carousel__nav-item--p').get(0),
				},
				pagination: {
					el: block.find('.ui-carousel__dots').get(0),
					clickable: true,
					bulletActiveClass: 'active',
					renderBullet: function(i, className) {
						return '<button class="ui-carousel__dots-item ' + className + '" type="button"></button>';
					}
				}
			}, opts);

		sliderS = new Swiper(slider.get(0), swiperOpts);

		block.removeAttr('data-carousel');

		block.data('carouselInit', true);
	},

	/*
	 * Iframe video
	*/
	video: {
		ytLoaded: false,
		init(block) {
			let _this = this,
				play = block.find('.ui-video__play'),
				frame = block.find('.ui-video__frame'),
				type = block.attr('data-type') || 'simple',
				isActive = false;
			
			play.on('click', function() {
				if (!isActive) {
					if (type == 'simple') {
						let url  = block.attr('data-url');
						frame.html(`
							<iframe src="${url}"  frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
						`);
					}
	
					if (type == 'controls') {
						let player;

						block.on('yt.loaded', function() {
							player = new YT.Player(block.find('.ui-video__frame-in').attr('id'), {
								videoId: block.attr('data-video'),
								width: '100%',
								height: '100%',
								playerVars: {
									autoplay: 1,
									controls: 1,
									rel: 0
								},
								events: {
									onReady: function() {
										player.seekTo(0);
									}
								}
							});
						});

						if (!app.video.ytLoaded) {
							$.getScript('http://www.youtube.com/iframe_api');
						} else {
							block.trigger('yt.loaded');
						}
	
						block.closest('.ui-video-container').find('[data-seek]').on('click', function() {
							player.seekTo($(this).data('seek'), true);
							player.playVideo();
						});
					}
	
					isActive = true;
					block.addClass('active');
					block.closest('.ui-video-container').addClass('active');
	
				}
			});
	
			block.data('videoInit', true);
		},
	},

	/*
	 * Business pages
	*/
	bpage: {
		init() {
			let _this = this;

			_this.header();
		},
		header() {
			app.waypoint({
				position: function() {
					let pos = $('.bpage__main').offset().top;
		
					return pos;
				},
				onDown: function() {
					$('.bpage__header').addClass('bpage__header--scrolled');
				},
				onUp: function() {
					$('.bpage__header').removeClass('bpage__header--scrolled');
				}
			});

			$(document).on('click', '.bpage__header-menu-link', function() {
				let offs = 80;

				app.scrollTo($(this).attr('data-anchor'), {
					offset: offs,
					speed: 500
				});
			});
		}
	},

	/*
	 * Price plans
	*/
	plans(block) {
		$(window).on('resize', function() {
			if (app.matches('min-width:601px')) {
				let items = block.find('.plans__item'),
					lines = 0;

				block.addClass('sizing');

				items.each(function() {
					$(this).find('.plans__item-sizer').each(function(i) {
						$(this).attr('data-sizer', i+1);
					});

					if ($(this).find('.plans__item-sizer').length > lines) {
						lines = $(this).find('.plans__item-sizer').length;
					}
				});

				for (var i = 1; i <= lines; i++) {
					let height = 0;

					block.find('.plans__item-sizer[data-sizer="'+i+'"]').each(function() {
						height = Math.max($(this).outerHeight(), height);
					});

					block.find('.plans__item-sizer[data-sizer="'+i+'"]').css('--line-height', height.toFixed(0) + 'px');
				}
				
				block.find('.plans__item-sizer').removeAttr('data-sizer');
				block.removeClass('sizing');
			}
		});

		$(window).trigger('resize');

		block.data('plansInit', true);
	},

	/*
	 * Features
	*/
	features(block) {
		let items = block.find('.features__item'),
			hl = +items.eq(0).outerHeight().toFixed(),
			isScrolled = false;

		block.css('--features-hl', hl + 'px');

		$(window).on('app.loaded', function() {
			if (!isScrolled) {
				hl = +items.eq(0).outerHeight().toFixed();
				block.css('--features-hl', hl + 'px');
			}
		});

		$(window).on('scroll resize', function() {
			let hlT = +($(window).scrollTop() + ($(window).height() - hl) * .5).toFixed(),
			hlB = +($(window).scrollTop() + ($(window).height() - hl) * .5 + hl).toFixed();

			items.each(function(i) {
				let item = $(this),
					itemT = item.offset().top;

				if (hlB >= itemT) {
					hl = +item.outerHeight().toFixed();

					hlT = +($(window).scrollTop() + ($(window).height() - hl) * .5).toFixed();
					hlB = +($(window).scrollTop() + ($(window).height() - hl) * .5 + hl).toFixed();

					isScrolled = true;
				}

				if (hlB > itemT) {
					item.addClass('active');
				} else {
					item.removeClass('active');
				}
			});

			block.css('--features-hl', hl + 'px');
		});

		$(window).trigger('scroll');

		block.data('plansInit', true);
	},

	/*
	 * Animated quotes
	*/
	quote(block) {
		let texts = block.find('.ui-quote__text');

		texts.each(function() {
			let text = $(this),
				html = text.html().trim();

			text.data('old', html);
			text.html('');

			html = html.split(' ');

			$.each(html, function(i) {
				text.append(`
					<span class="ui-quote__item" style="--dur:${(Math.random() * (3 - 2) + 2).toFixed(1)}s;--delay:${(Math.random() * (0.5 - 0) + 0).toFixed(2)}s;--blur:${(Math.random() * (10 - 1) + 1).toFixed(0)}px">${html[i]}</span>
				`);
				text.append(' ');
			});

			// console.log(html);
		});

		$(window).on('resize scroll', function() {
			if ($(window).scrollTop() + $(window).height() * .7 > block.offset().top) {
				block.addClass('active');
			}
		});

		block.data('quoteInit', true);
	},

	cabinet: {
		init(block) {
			let _this = this;

			_this.area(block.find('.cabinet__area'));

			block.data('cabinetInit', true);
		},
		area(block) {
			let sel = block.find('.ui-select');

			block.find('[data-pop-area]').on('click', function() {
				let id = $(this).attr('data-pop-area');

				sel.find('select').trigger('change');

				sel.find('option[data-area="'+id+'"]').prop('selected', true);
				sel.find('.ui-select__mult-pop li[data-area="'+id+'"]').addClass('selected');

				setTimeout(function() {
					sel.find('.ui-select__head').trigger('click');
				});
			});

			block.find('[data-area-remove]').on('click', function() {
				let id = $(this).attr('data-area-remove');

				sel.find('select').trigger('change');

				sel.find('option[data-area="'+id+'"]').prop('selected', false);
				sel.find('.ui-select__mult-pop li[data-area="'+id+'"]').removeClass('selected');

				$(this).remove();

				// setTimeout(function() {
				// 	sel.find('.ui-select__head').trigger('click');
				// });
			});
		}
	}
};
	
//=include ../modules/cheg.units/functions.js

//=include ../modules/cheg.scrollto/functions.js

//=include ../modules/cheg.tabs/functions.js
//=include ../modules/cheg.accordions/functions.js
//=include ../modules/cheg.expand/functions.js

//=include ../modules/cheg.scrolllock/functions.js
//=include ../modules/cheg.popups/functions.js

//=include ../modules/cheg.lazyload/functions.js

//=include ../modules/cheg.menu/functions.js

//=include ../modules/cheg.loadfile/functions.js

//=include ../modules/cheg.waypoint/functions.js

//=include ../modules/cheg.checkwebp/functions.js

/*
 * Init
*/
app.init = () => {
	// * Units
	app.units.all();

	// * Img lazy-load
	app.lazyLoad.init();

	// * Tabs
	$('.ui-tabs').not('.custom').each(function () {
		if (!$(this).data('tabsInit')) {
			app.tabs.init($(this));
		}
	});
	app.tabs.bind();

	// * Accordions
	$('.ui-accordion').not('.custom').each(function () {
		if (!$(this).data('accordionInit')) {
			app.accordions($(this));
		}
	});

	// * Expandable blocks
	$('.ui-expand').not('.custom').each(function () {
		if (!$(this).data('expandInit')) {
			app.expand($(this));
		}
	});

	// * Popups
	$('.popup').each(function () {
		if (!$(this).data('popupsInit')) {
			app.popups.init($(this));
		}
	});
	app.popups.bind();

	// * Wall
	$('.wall__grid').not('.wall__grid--ah').each(function () {
		if (!$(this).data('wallInit')) {
			//app.wall($(this));
		}
	});

	// * Carousel
	$('.ui-carousel').each(function () {
		if (!$(this).data('carouselInit')) {
			app.carousel($(this));
		}
	});

	// * Iframe video
	$('.ui-video').each(function () {
		if (!$(this).data('videoInit')) {
			app.video.init($(this));
		}
	});

	// * Form styler
	$('.ui-select').not('.custom').each(function () {
		if (!$(this).data('selectInit')) {
			app.styler.select($(this));
		}
	});

	// * Search
	$('.search__line').each(function () {
		if (!$(this).data('searchInit')) {
			app.search.init($(this));
		}
	});

	// * Plans
	$('.plans').each(function () {
		if (!$(this).data('plansInit')) {
			app.plans($(this));
		}
	});

	// * Features
	$('.features').each(function () {
		if (!$(this).data('featuresInit')) {
			app.features($(this));
		}
	});

	// * Quote
	$('.ui-quote').each(function () {
		if (!$(this).data('quoteInit')) {
			app.quote($(this));
		}
	});

	// * Cabinet
	$('.cabinet').each(function () {
		if (!$(this).data('cabinetInit')) {
			app.cabinet.init($(this));
		}
	});
}

window.onYouTubeIframeAPIReady = function() {
	app.video.ytLoaded = true;
	$('.ui-video').trigger('yt.loaded');
}
app.deviceIs.addClasses(document.documentElement);
app.detectBrowser();

(function () {
	app.deviceIs.touch ? $('html').addClass('touch') : $('html').addClass('no-touch');

	app.settings.winWidth = $(window).width();
	app.settings.winHeight = $(window).height();
	app.settings.scrollPos = $(window).scrollTop();

	// * Init
	app.init();
	if ($('.bpage').length) {
		app.bpage.init();
	}

	//app.popups.open('password-changed');

	// * Menu binds
	app.menu.bind();

	$(document).on('click', '.ui-tags__more', function() {
		$(this).closest('.ui-tags').toggleClass('active');
	});

	$(document).on('click', '.category__show-btn', function() {
		$(this).closest('.category__grid').addClass('full');
	});

	$(document).on('click', '.ui-filters__trigger', function() {
		$(this).closest('.ui-filters').toggleClass('active');
	});

	$(document).on('click', '.ui-tabs-trigger', function() {
		$('html, body').animate({
			scrollTop: $(this).offset().top - 100
		}, 500);
	});

	$(document).on('click', '.header__cabinet-avatar', function() {
		$(this).closest('.header__cabinet').toggleClass('active');
	});
	
	$(document).on('click', function (e) {
		if (!$(e.target).closest('.header__cabinet').length) {
			$('.header__cabinet').removeClass('active');
		}
	});

	$(document).on('click', '.ui-input__pass', function() {
		let label = $(this).closest('.ui-input'),
			inp = label.find('input');

		if (!label.hasClass('show')) {
			label.addClass('show');
			inp.attr('type', 'text');
		} else {
			label.removeClass('show');
			inp.attr('type', 'password');
		}
	});
	
	app.waypoint({
		position: 1,
		onDown: function() {
			$('.header').addClass('header--scrolled');
		},
		onUp: function() {
			$('.header').removeClass('header--scrolled');
		}
	});


	if (app.deviceIs.desktop) {
		$(window).on('resize', function () {
			app.units.all();
		});
	} else {

	}

	if (app.deviceIs.mobile || app.deviceIs.tablet) {
		$(window).on('orientationchange', function () {
			app.units.vh();
		}).on('resize', function () {
			app.units.mobile();
		});
	}

	$(window).on('resize', function () {
		app.settings.winWidth = $(window).width();
		app.settings.winHeight = $(window).height();
		app.settings.scrollPos = $(window).scrollTop();

		app.settings.menuOpened ? app.menu.close() : null;
	}).on('scroll', function () {
		app.settings.scrollPos = $(window).scrollTop();
	}).trigger('resize').trigger('scroll');

	// * Scroll to element
	$(document).on('click', 'a[href^="#"], [data-scrollto]', function (e) {
		e.preventDefault();
		let el = $(this).attr('href') || $(this).attr('data-scrollto');

		app.scrollTo(el, {
			offset: app.settings.scrollOffset()
		});
	});
})(jQuery);

$(window).on('load', function () {
	setTimeout(function () {
		// * hide preloader
		$('.preloader').fadeOut(1000, function () {
			$(this).remove();
		});
		$('.app').addClass('app--loaded');
		app.settings.appLoaded = true;
		$(window)
			.trigger('app.loaded')
			.trigger('scroll');
	}, 300);

	// * Scroll to hash on page laod
	app.toHash();
});