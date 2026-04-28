import * as vscode from "vscode";
import { prettyPrintAxon } from "./prettyPrint";

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand("axonWrangler.prettyPrint", async () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showInformationMessage("Axon Wrangler: open an Axon file before pretty-printing.");
      return;
    }

    const document = editor.document;
    const selection = editor.selection;
    const targetRange = selection.isEmpty
      ? fullDocumentRange(document)
      : new vscode.Range(selection.start, selection.end);
    const original = document.getText(targetRange);
    const formatted = prettyPrintAxon(original);

    if (formatted === original) {
      vscode.window.showInformationMessage("Axon Wrangler: already pretty enough.");
      return;
    }

    await editor.edit((editBuilder) => {
      editBuilder.replace(targetRange, formatted);
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  // Nothing to clean up yet.
}

function fullDocumentRange(document: vscode.TextDocument): vscode.Range {
  const lastLine = document.lineAt(document.lineCount - 1);
  return new vscode.Range(new vscode.Position(0, 0), lastLine.range.end);
}
