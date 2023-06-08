/*
 * Accordions
 */
app.accordions = (acc, options) => {
	// default options
	options = $.extend({
		initialized: false,
		collapsable: true,
		collapsed: false,
		connected: false,
		scrollToItem: false,
		scrollToItemWidth: 768,
		fixedHeight: false,
		slideSpeed: app.settings.animDuration
	}, options);

	let pref = '.ui-accordion',
		itemsSel = pref+'__item',
		triggersSel = pref+'__trigger',
		panelsSel = pref+'__panel',
		items = acc.find(itemsSel),
		triggers = acc.find(triggersSel),
		panels = acc.find(panelsSel),
		itemF;

	const isNumber = (value) => {
		return typeof value === 'number' && isFinite(value);
	}

	// if it's disabled to close all items
	if (acc.attr('data-collapsable') == 'false') {
		options.collapsable = false;
	}

	// if all items collapsed by default
	if (acc.attr('data-collapsed') == 'true') {
		options.collapsed = true;
	}

	// if scroll-to-item disabled
	if (acc.attr('data-scrollToItem') == 'false') {
		options.scrollToItem = false;
	}

	// if scroll-to-item disabled
	if (acc.attr('data-scrollToItemWidth') && isNumber(+acc.attr('data-scrollToItemWidth'))) {
		options.scrollToItemWidth = +acc.attr('data-scrollToItemWidth');
	}

	// if connected blocks exist
	if (acc.attr('data-acc')) {
		options.connected = true;
	}

	// if height must be fixed
	if (acc.attr('data-fixedHeight') == 'true') {
		options.fixedHeight = true;
	}

	// items positions for scroll-to-item
	const itemsPos = () => {
		panels.hide(0);
		
		items.each(function() {
			$(this).data('itemPos', ($(this).offset().top - app.settings.scrollOffset - 30));
		});

		acc.find(itemsSel+'.active')
			.first()
				.find(panelsSel)
					.show(0);
	}

	// open/close item
	const itemAction = (item, action) => {
		let slideSpeed = options.slideSpeed;

		if (!options.initialized) {
			slideSpeed = 0;
		} else {
			slideSpeed = options.slideSpeed;
		}

		if (action == 'open') {
			if (options.initialized && options.scrollToItem) {
				if (window.matchMedia('(max-width:'+(options.scrollToItemWidth)+'px)').matches) {
					$('html, body').animate({
						scrollTop: item.data('itemPos')
					}, slideSpeed);
				}
			}

			items.removeClass('active');
			item.addClass('active');

			panels.slideUp(slideSpeed);
			item.find(panelsSel).slideDown(slideSpeed);

			/*if (options.connected) {
				var accID = acc.attr('data-acc'),
					itemID = item.attr('data-acc-item'),
					accCon = $('[data-acc-con="' + accID + '"]'),
					accConItems = accCon.find('[data-acc-con-item]');

				accConItems.removeClass('active');
				accCon.find('[data-acc-con-item="' + itemID + '"]').addClass('active');
			}*/
		} else {
			item.removeClass('active');
			panels.slideUp(slideSpeed);
		}

		if (!options.initialized) {
			options.initialized = true;
		}
	}

	// show default item
	if (!options.collapsed) {
		if (!acc.find(itemsSel+'.active').length || acc.find(itemsSel+'.active').length > 1) {
			items.removeClass('active');
			itemF = items.first();
		} else {
			itemF = acc.find(itemsSel+'.active');
		}

		itemAction(itemF, 'open');
	} else {
		options.initialized = true;
	}

	// calculate accordion height for fixedHeight = true
	const fixedHeight = () => {
		let height = 0,
			active = acc.find(itemsSel+'.active');

		panels.hide(0);

		acc.addClass('sizing');
		
		items.each(function() {
			items.removeClass('sizing');

			$(this).addClass('sizing');

			height = Math.max(height, acc.outerHeight());

			$(this).removeClass('sizing');
		});

		acc.removeClass('sizing');
		active.find(panelsSel).show(0);

		acc.css('--acc-height', (height + 1).toFixed(0) + 'px');
	}

	// clicking on trigger
	triggers.on('click', function() {
		let item = $(this).closest(itemsSel);

		if (!item.hasClass('active')) {
			itemAction(item, 'open');
		} else {
			if (options.collapsable) {
				itemAction(item, 'close');
			}
		}
	});

	// calculate items positions on resize
	$(window).on('resize', function() {
		if (options.scrollToItem) {
			itemsPos();
		}

		if (options.fixedHeight) {
			fixedHeight();
		}
	});
	
	$(window).trigger('resize');
	$(window).on('load', function() {
		$(window).trigger('resize');
	});

	acc.data('accordionInit', true);
}