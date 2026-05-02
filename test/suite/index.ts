import * as assert from "node:assert/strict";
import * as vscode from "vscode";

export async function run(): Promise<void> {
  await testAxonActivation();
  await testPrettyPrintCommandFormatsActiveAxonDocument();
}

async function testAxonActivation(): Promise<void> {
  const document = await vscode.workspace.openTextDocument({
    language: "axon",
    content: "readAll(point)\n",
  });
  await vscode.window.showTextDocument(document);

  const extension = vscode.extensions.getExtension("pipseedai.axon-wrangler");
  assert.ok(extension, "Axon Wrangler extension should be registered in the extension host");
  await extension.activate();

  assert.equal(document.languageId, "axon");
  assert.equal(extension.isActive, true);
}

async function testPrettyPrintCommandFormatsActiveAxonDocument(): Promise<void> {
  const document = await vscode.workspace.openTextDocument({
    language: "axon",
    content: "readAll(point)  \n\n\n",
  });
  await vscode.window.showTextDocument(document);

  await vscode.commands.executeCommand("axonWrangler.prettyPrint");

  assert.equal(document.getText(), "readAll(point)\n");
}
