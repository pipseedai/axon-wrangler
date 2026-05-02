import * as vscode from "vscode";
import { findAxonDiagnostics } from "./diagnostics";

export function registerAxonDiagnostics(context: vscode.ExtensionContext): void {
  const collection = vscode.languages.createDiagnosticCollection("axon-wrangler");

  const refresh = (document: vscode.TextDocument) => {
    if (!isAxonDocument(document)) return;

    const diagnostics = findAxonDiagnostics(document.getText()).map((finding) => {
      const diagnostic = new vscode.Diagnostic(
        new vscode.Range(document.positionAt(finding.start), document.positionAt(finding.end)),
        finding.message,
        vscode.DiagnosticSeverity.Warning,
      );
      diagnostic.code = finding.code;
      diagnostic.source = "Axon Wrangler";
      return diagnostic;
    });

    collection.set(document.uri, diagnostics);
  };

  for (const document of vscode.workspace.textDocuments) {
    refresh(document);
  }

  context.subscriptions.push(
    collection,
    vscode.workspace.onDidOpenTextDocument(refresh),
    vscode.workspace.onDidChangeTextDocument((event) => refresh(event.document)),
    vscode.workspace.onDidCloseTextDocument((document) => collection.delete(document.uri)),
  );
}

function isAxonDocument(document: vscode.TextDocument): boolean {
  return document.languageId === "axon" || document.fileName.endsWith(".axon");
}
