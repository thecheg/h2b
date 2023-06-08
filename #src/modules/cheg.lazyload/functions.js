/*
 * Lazy-loading - img, picture
*/
app.lazyLoad = {
	define(el) {
		let observer = new window.IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				if (!el.data('loaded')) {
					this.show(el);
					//console.log('enter')
					el
						.data('loaded', true)
						.addClass('loaded');
				}
				return;
			}
		}, {
			root: null,
			threshold: 0.1,
		})

		observer.observe(el.get(0));
	},
	show(el) {
		if (el.is('img')) {
			el.attr('src', el.attr('data-src'));
			el.on('load', function () {
				el.removeAttr('data-src');
			});
		}
		if (el.is('picture')) {
			let img = el.find('img'),
				source = el.find('source');

			img.attr('src', img.attr('data-src'));

			source.each(function() {
				$(this).attr('srcset', $(this).attr('data-srcset'));
			});
		}
	},
	init() {
		let _this = this;

		$('.lazyLoad').each(function (e, el) {
			_this.define($(el));
		});
	}
}