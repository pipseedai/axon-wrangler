import * as vscode from "vscode";
import {
  axonDocumentFormattingProvider,
  axonRangeFormattingProvider,
  buildFormattingTextEdit,
  fullDocumentRange,
} from "./formatting";

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
    const edits = buildFormattingTextEdit(document, targetRange);

    if (edits.length === 0) {
      vscode.window.showInformationMessage("Axon Wrangler: already pretty enough.");
      return;
    }

    await editor.edit((editBuilder) => {
      for (const edit of edits) {
        editBuilder.replace(edit.range, edit.newText);
      }
    });
  });

  const documentFormatter = vscode.languages.registerDocumentFormattingEditProvider(
    "axon",
    axonDocumentFormattingProvider,
  );
  const rangeFormatter = vscode.languages.registerDocumentRangeFormattingEditProvider(
    "axon",
    axonRangeFormattingProvider,
  );

  context.subscriptions.push(disposable, documentFormatter, rangeFormatter);
}

export function deactivate(): void {
  // Nothing to clean up yet.
}
