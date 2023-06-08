/*
 * Load file
*/
app.loadFile = {
	loaded: [],
	js(opts) {
		let _this = this;

		opts = $.extend({
			src: '',
			target: 'body',
			pos: 'end',
			cb: function() {}
		}, opts);

		if (!_this.loaded.includes(opts.src)) {
			let script = document.createElement('script'),
				target = document.body;

			script.setAttribute('src', opts.src);

			if (opts.target !== 'body') {
				target = document.getElementsByTagName('head')[0];
			}

			if (opts.pos == 'end') {
				target.append(script);
			} else {
				target.prepend(script);
			}

			// now wait for it to load.
			script.onload = () => {
				_this.loaded.push(opts.src);

				_this.callback(opts.cb);
			}
		} else {
			_this.callback(opts.cb);
		}
	},
	css(opts) {
		let _this = this;

		opts = $.extend({
			src: '',
			target: 'head',
			pos: 'end',
			cb: function() {}
		}, opts);

		if (!_this.loaded.includes(opts.src)) {
			let link = document.createElement('link'),
				target = document.getElementsByTagName('head')[0];
			
			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('href', opts.src);

			if (opts.target !== 'head') {
				target = document.body;
			}

			if (opts.pos == 'end') {
				target.append(link);
			} else {
				target.prepend(link);
			}

			_this.loaded.push(opts.src);
		}

		_this.callback(opts.cb);
	},
	callback(cb) {
		if (cb && typeof cb == 'function') {
			cb.call();
		}
	}
}