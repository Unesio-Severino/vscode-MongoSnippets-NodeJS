// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';

const vscode = require('vscode');
const path = require('path');

const AppModel = require('./appModel').AppModel;
// @ts-ignore
const precode = require("./precode.json");


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Mongo Snippets has been activated.');
	const appModel = new AppModel();
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let mongooseDocs = vscode.commands.registerCommand('extension.mongoosejsDocs', function () {
		// The code you place here will be executed every time your command is executed
		vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://mongoosejs.com/docs/api.html#Model'))
	});

	let extensionDocs = vscode.commands.registerCommand('extension.extensionDocs', () => {

		vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://github.com/roerohan/vscode-MongoSnippets-NodeJS/blob/master/README.md'))
	});


	let setup = vscode.commands.registerCommand('extension.setup', () => {
		let folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
		
		let dbContent = precode["connect"].join("\n");
		let userModelContent = precode["user model"].join("\n");

		appModel.makefolders([
			path.join(folderPath, "models"),
			path.join(folderPath, "routes")
		]);

		appModel.makefiles([
			path.join(folderPath, "routes/index.js"),
			path.join(folderPath, "models/db.js"),
			path.join(folderPath, "models/user.model.js")
		],
		[
			"var User = require('../models/user.model');",
			dbContent,
			userModelContent
		]);

	});

	context.subscriptions.push(mongooseDocs);
	context.subscriptions.push(extensionDocs);
	context.subscriptions.push(setup);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}