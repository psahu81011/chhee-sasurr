# Chhee-sasurr

A VS Code extension that plays audio notifications when terminal commands complete.

## Features

- 🔊 **Audio Notifications**: Plays a sound when terminal commands succeed or fail
- 🔇 **Toggle Sound**: Quickly enable/disable sounds via status bar button
- ⚙️ **Customizable Sounds**: Set your own audio files for success and failure outcomes
- ✅ **Success Sound (Optional)**: Only play sound on successful commands if enabled
- 📝 **File Validation**: Checks that sound files exist and are valid audio formats

## Extension Settings

This extension contributes the following settings:

* `chhee-sasurr.enableSound`: Enable or disable sound playback on terminal exit. (default: `true`)
* `chhee-sasurr.enableSuccessSound`: Enable sound playback when terminal commands succeed. (default: `false`)
* `chhee-sasurr.successSound`: Path to the sound file played on success. (default: `assets/success.mp3`)
* `chhee-sasurr.failureSound`: Path to the sound file played on failure. (default: `assets/failure.mp3`)

## Usage

The extension listens for terminal command exits and:
1. Plays the **failure sound** if the command exits with a non-zero code
2. Plays the **success sound** only if the command succeeds AND `enableSuccessSound` is enabled

Click the **Chhee** button in the status bar to toggle sound playback on/off.

## Release Notes

### 0.0.1

Initial release of Chhee-sasurr.

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
