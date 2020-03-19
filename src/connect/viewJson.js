const vscode = require('vscode');
const path = require('path');
const { listAllCollections, listDocs } = require('./showDB');

async function viewJson() {
    var dbName = await vscode.window.showInputBox({
        placeHolder: "Enter a connection string to the database.",
        value: "mongodb://",
        // @ts-ignore
        ignoreFocusOut: true,
        prompt: "Valid connection strings usually begin with 'mongodb://'."
    });

    if (!dbName) return;

    try {
        var items = await listAllCollections(dbName);
        var choice = await vscode.window.showQuickPick(items, {
            placeHolder: 'Choose a Collection:'
        })

        if (!choice) return;

        var docs = await listDocs(dbName, choice);

        // @ts-ignore
        const newFile = vscode.Uri.parse('untitled:' + path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, `${choice}.json`));
        const document = await vscode.workspace.openTextDocument(newFile);

        const edit = new vscode.WorkspaceEdit();

        var display = JSON.stringify(docs, null, "\t");

        // const MarkdownString = new vscode.CodeLens()

        edit.insert(newFile, new vscode.Position(1, 0), display);

        const success = await vscode.workspace.applyEdit(edit);

        if (success) {
            vscode.window.showTextDocument(document);
        } else {
            vscode.window.showErrorMessage('Unexpected Failure! Could not write to file.');
        }
    } catch (err) {
        vscode.window.showErrorMessage(err);
    }
}

module.exports = viewJson;