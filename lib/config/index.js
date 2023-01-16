function DisableOutputWebpackPlugin(options) {
	if (options && options.test && !Array.isArray(options.test))
		options.test = [options.test]

	this.options = options
}

DisableOutputWebpackPlugin.prototype.apply = function(compiler) {
	compiler.hooks.emit.tapAsync('DisableOutputWebpackPlugin', (compilation, callback) => {

		if (this.options && this.options.test) {
			if (Object.keys(compilation.assets).length === 0 ) {
				throw Error ('Error: The asset pre-theme is not there!')
			}
			Object.keys(compilation.assets).forEach((asset) => {
				let output = true
				this.options.test.some((regex) => {
					if (asset.match(regex) != null) {
						output = false
						return true
					}
					return false
				})

				if (!output)
					delete compilation.assets[asset]
			});
		} else {
			Object.keys(compilation.assets).forEach((asset) => {
				delete compilation.assets[asset]
			})
		}

		callback();
	});
};

module.exports = DisableOutputWebpackPlugin;