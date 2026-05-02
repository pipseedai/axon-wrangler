import * as vscode from "vscode";
import { AXON_HOVERS } from "./hoverData";

const WORD_PATTERN = /[A-Za-z_][A-Za-z0-9_]*/;

export function getAxonHoverMarkdown(word: string): vscode.MarkdownString | undefined {
  const entry = AXON_HOVERS[word];
  if (!entry) return undefined;

  const markdown = new vscode.MarkdownString(undefined, true);
  markdown.isTrusted = false;
  markdown.appendMarkdown(`**${entry.label}**\n\n${entry.detail}`);
  if (entry.example) {
    markdown.appendCodeblock(entry.example, "axon");
  }
  return markdown;
}

export const axonHoverProvider: vscode.HoverProvider = {
  provideHover(document, position) {
    const range = document.getWordRangeAtPosition(position, WORD_PATTERN);
    if (!range) return undefined;

    const word = document.getText(range);
    const markdown = getAxonHoverMarkdown(word);
    return markdown ? new vscode.Hover(markdown, range) : undefined;
  },
};
