// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

let statusBarItem: vscode.StatusBarItem;

function updateStatusBar() {
	const isSoundEnabled = vscode.workspace.getConfiguration('chhee-sasurr').get<boolean>('enableSound');
	statusBarItem.text = isSoundEnabled ? `$(unmute) Chhee: ON` : `$(mute) Chhee: OFF`;
	statusBarItem.tooltip = `Click to ${isSoundEnabled ? 'Mute' : 'Unmute'} terminal sounds`;
}

export function activate(context: vscode.ExtensionContext) {
	// Get configuration
	const config = vscode.workspace.getConfiguration('chhee-sasurr');
	const successSound = config.get<string>('successSound', '');
	const failureSound = config.get<string>('failureSound', '');

	if (!failureSound) {
		vscode.window.showWarningMessage('No failure sound configured. Please set "chhee-sasurr.failureSound" in your settings.');
		return;
	}

	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = 'chhee-sasurr.toggleSound';
	context.subscriptions.push(statusBarItem);

	updateStatusBar();
	statusBarItem.show();

	const toggleCommand = vscode.commands.registerCommand('chhee-sasurr.toggleSound', async () => {
		const config = vscode.workspace.getConfiguration('chhee-sasurr');
		const currentSoundStatus = config.get<boolean>('enableSound');

		// Update the actual setting in VS Code
		await config.update('enableSound', !currentSoundStatus, vscode.ConfigurationTarget.Global);

		// Visual feedback
		const status = currentSoundStatus ? 'Muted' : 'Unmuted';
		vscode.window.showInformationMessage(`Chhee-sasurr is now ${status}`);
		updateStatusBar();
	});

	console.debug('Congratulations, your extension "chhee-sasurr" is now active!');
	console.debug('Success sound path:', successSound);
	console.debug('Failure sound path:', failureSound);

	const terminalListener = vscode.window.onDidEndTerminalShellExecution((e) => {
		// Check if sound is enabled (read fresh from config each time)
		const config = vscode.workspace.getConfiguration('chhee-sasurr');
		const isSoundEnabled = config.get<boolean>('enableSound');
		if (!isSoundEnabled) {
			console.debug('Sound playback is disabled in settings.');
			return;
		}

		console.debug(e.exitCode);
		if (e.exitCode === undefined) {
			console.warn('Terminal shell execution ended without an exit code. Skipping sound playback.');
			return;
		}

		const isSuccess = e.exitCode === 0;

		// Check if success sounds are enabled (only relevant for success outcomes)
		const enableSuccessSound = config.get<boolean>('enableSuccessSound');

		// Determine which sound to play
		let soundPath = '';
		if (isSuccess && enableSuccessSound) {
			// Play success sound only if success sounds are enabled
			soundPath = successSound;
		} else if (!isSuccess) {
			// Always play failure sound on failure
			soundPath = failureSound;
		}
		// If success but success sounds disabled, soundPath remains empty

		if (soundPath) {
			// Resolve the path - if it's relative, resolve it relative to extension folder
			let resolvedPath = soundPath;
			if (!path.isAbsolute(soundPath)) {
				resolvedPath = path.join(context.extensionPath, soundPath);
			}

			// Check if the sound file exists
			if (!fs.existsSync(resolvedPath)) {
				console.error('Sound file not found:', resolvedPath);
				return;
			}

			// Validate sound file extension
			const validAudioExtensions = ['.mp3', '.wav', '.aiff', '.flac', '.ogg', '.m4a', '.wma'];
			const fileExtension = path.extname(resolvedPath).toLowerCase();
			if (!validAudioExtensions.includes(fileExtension)) {
				console.error('Invalid audio file format:', fileExtension, '- Supported formats:', validAudioExtensions.join(', '));
				return;
			}

			// Check if file is not empty
			const stats = fs.statSync(resolvedPath);
			if (stats.size === 0) {
				console.error('Sound file is empty:', resolvedPath);
				return;
			}

			console.debug('Resolved sound path:', resolvedPath);

			// Play the sound using the appropriate method for the OS
			const platform = process.platform;
			let command = '';

			if (platform === 'win32') {
				// Windows: Use PowerShell to play the sound
				command = `powershell -c (New-Object Media.SoundPlayer "${resolvedPath}").PlaySync();`;
			} else if (platform === 'darwin') {
				// macOS: Use afplay to play the sound
				command = `afplay "${resolvedPath}"`;
			} else if (platform === 'linux') {
				// Linux: Use aplay or paplay to play the sound
				command = `paplay "${resolvedPath}" || aplay "${resolvedPath}"`;
			} else {
				console.warn('Unsupported platform for playing sounds:', platform);
			}

			if (command) {
				exec(command, (error: any, stdout: any, stderr: any) => {
					if (error) {
						console.error('Error playing sound:', error.message);
					} else {
						console.debug('Sound played successfully');
					}
				});
			}
		} else {
			console.debug('No sound configured for this outcome.');
		}
	});

	const configListener = vscode.workspace.onDidChangeConfiguration((e) => {
		if (e.affectsConfiguration('chhee-sasurr.enableSound')) {
			updateStatusBar();
			console.debug('Sound playback toggle changed.');
		}
		if (e.affectsConfiguration('chhee-sasurr.enableSuccessSound')) {
			console.debug('Success sound setting changed.');
		}
	});

	context.subscriptions.push(toggleCommand, terminalListener, configListener);
}

// This method is called when your extension is deactivated
export function deactivate() {}
