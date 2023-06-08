/*
 * Tabs
*/
app.tabs = {
	init(tabs) {
		let pref = '.ui-tabs',
			itemSel = pref+'__item',
			items = tabs.find(itemSel),
			id = tabs.attr('data-tabs'),
			active = '';
	
		if (!tabs.find(itemSel+'.active').length || tabs.find(itemSel+'.active').length > 1) {
			items.removeClass('active');
			items.first().addClass('active');
		}
	
		items.on('click', function () {
			let item = $(this),
				tabId = item.attr('data-tab');

			items.removeClass('active');

			$(`${pref}-trigger[data-tabs="${id}"], ${pref}-content[data-tabs="${id}"]`).removeClass('active');

			item.addClass('active');

			$(`${pref}-trigger[data-tabs="${id}"][data-tab="${tabId}"], ${pref}-content[data-tabs="${id}"][data-tab="${tabId}"]`).addClass('active');

			active = tabId;
		});

		tabs.find(itemSel+'.active').trigger('click');
	
		tabs.data('tabsInit', true);
	},
	bind() {
		$(document).on('click', '.ui-tabs-trigger', function() {
			$(`.ui-tabs[data-tabs="${$(this).attr('data-tabs')}"]`)
				.find(`.ui-tabs__item[data-tab="${$(this).attr('data-tab')}"`)
				.trigger('click');
		});
	}
}