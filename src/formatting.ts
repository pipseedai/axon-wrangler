import * as vscode from "vscode";
import { prettyPrintAxon } from "./prettyPrint";

export function fullDocumentRange(document: vscode.TextDocument): vscode.Range {
  const lastLine = document.lineAt(document.lineCount - 1);
  return new vscode.Range(new vscode.Position(0, 0), lastLine.range.end);
}

export function buildFullDocumentTextEdit(document: vscode.TextDocument): vscode.TextEdit[] {
  const range = fullDocumentRange(document);
  return buildFormattingTextEdit(document, range);
}

export function buildFormattingTextEdit(document: vscode.TextDocument, range: vscode.Range): vscode.TextEdit[] {
  const original = document.getText(range);
  const formatted = prettyPrintAxon(original);
  return formatted === original ? [] : [vscode.TextEdit.replace(range, formatted)];
}

export const axonDocumentFormattingProvider: vscode.DocumentFormattingEditProvider = {
  provideDocumentFormattingEdits(document) {
    return buildFullDocumentTextEdit(document);
  },
};

export const axonRangeFormattingProvider: vscode.DocumentRangeFormattingEditProvider = {
  provideDocumentRangeFormattingEdits(document, range) {
    return buildFormattingTextEdit(document, range);
  },
};
