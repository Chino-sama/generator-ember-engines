"use strict";
const Generator = require("yeoman-generator");

const camelCase = require("camelcase");

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);

		this.argument("action", { type: String, required: true });
		this.argument("addon", { type: String, required: true });
		this.argument("model", { type: String, required: true });

		this.option("prevent-export");
	}

	initializing() {
		let generateActions = ["g", "generate"];
		let deleteActions = ["d", "delete"];

		if (generateActions.includes(this.options.action)) {
			this.actionType = "generate";
		} else if (deleteActions.includes(this.options.action)) {
			this.actionType = "delete";
		} else {
			this.log.error(
				"Unsupported action. Supported action types are generate and delete"
			);
			done();
		}
	}

	writing() {
		let addonName = camelCase(this.options.addon, { pascalCase: true });
		let modelName = camelCase(this.options.model, { pascalCase: true });

		if (this.actionType === "generate") {
			if (!this.options["prevent-export"])
				this.fs.copyTpl(
					this.templatePath("re-export.js"),
					this.destinationPath(
						`app/models/${this.options.addon}/${this.options.model}.js`
					),
					{
						addonName: this.options.addon,
						modelName: this.options.model
					}
				);
			this.fs.copyTpl(
				this.templatePath("model.js"),
				this.destinationPath(
					`lib/api-${this.options.addon}/addon/models/${this.options.addon}/${this.options.model}.js`
				),
				{ addonName, modelName }
			);
			this.fs.copyTpl(
				this.templatePath("re-export.js"),
				this.destinationPath(
					`lib/api-${this.options.addon}/app/models/${this.options.addon}/${this.options.model}.js`
				),
				{ addonName: this.options.addon, modelName: this.options.model }
			);
		} else if (this.actionType === "delete") {
			if (!this.options["prevent-export"])
				this.fs.delete(
					`app/models/${this.options.addon}/${this.options.model}.js`
				);
			this.fs.delete(
				`lib/api-${this.options.addon}/addon/models/${this.options.addon}/${this.options.model}.js`
			);
			this.fs.delete(
				`lib/api-${this.options.addon}/app/models/${this.options.addon}/${this.options.model}.js`
			);
		}
	}
};
