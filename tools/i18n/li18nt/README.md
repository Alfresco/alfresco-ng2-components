# li18nt UI text style checker

The purpose of this tool is to provide style "lint" checking for the en.json
file, which is used as the starting point for i18n in the user interface. The
definitive guidelines can be found in the main
[style guide](https://docs.alfresco.com/sites/docs.alfresco.com/files/public/docs_team/u2/Alfresco-Writing-Guide.pdf) document. This tool implements the guidelines as a set of rules that can be
checked automatically for common errors (the [style rules](../UIStyleRules.md) file
contains a full description of the rules currently in use).

## Installing and using the VSCode extension

The VS Code extension shows the style warnings as underlined sections in the text
with corresponding notes in the Problems window, a lot like standard programming
language errors.

The extension is not available in the VS Code marketplace but you can install it
locally by copying it to the extensions folder. This can be found at the path

`$HOME/.vscode/extensions`

...on MacOSX and at

`%USERPROFILE%\.vscode\extensions`

...on Windows. Copy the `client` folder (from `alfresco-ng2-components/tools/i18n/li18nt/`)
to the extensions folder and rename it to `li18nt`. If there is no `node_modules`
folder in the new `li18nt` folder then you should also `cd` into this folder and
run `npm install`. When you restart VS Code, you should find `li18nt` listed among
the installed extensions in the extensions panel.

When active, the extension will only check the text of files named `en.json`.
Double-click an item from the Problems window in VS Code to highlight the section
of text where the issue occurs. You can find out more about why the error has
occurred and what to do about it in the [style rules](../UIStyleRules.md) file.
For the full description and explanation of all style guidelines, see the main
[style guide](https://docs.alfresco.com/sites/docs.alfresco.com/files/public/docs_team/u2/Alfresco-Writing-Guide.pdf).