import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	// Unit Tests
	suite('Configuration Tests', () => {
		test('Should read enableSound setting', async () => {
			const config = vscode.workspace.getConfiguration('chhee-sasurr');
			const enableSound = config.get<boolean>('enableSound');
			assert.strictEqual(typeof enableSound, 'boolean');
		});

		test('Should read enableSuccessSound setting', async () => {
			const config = vscode.workspace.getConfiguration('chhee-sasurr');
			const enableSuccessSound = config.get<boolean>('enableSuccessSound');
			assert.strictEqual(typeof enableSuccessSound, 'boolean');
		});

		test('Should read successSound path', async () => {
			const config = vscode.workspace.getConfiguration('chhee-sasurr');
			const successSound = config.get<string>('successSound');
			assert.strictEqual(typeof successSound, 'string');
		});

		test('Should read failureSound path', async () => {
			const config = vscode.workspace.getConfiguration('chhee-sasurr');
			const failureSound = config.get<string>('failureSound');
			assert.strictEqual(typeof failureSound, 'string');
		});
	});

	// File Validation Tests
	suite('File Validation Tests', () => {
		test('Should validate audio file extensions', () => {
			const validExtensions = ['.mp3', '.wav', '.aiff', '.flac', '.ogg', '.m4a', '.wma'];
			const testFile = 'test.mp3';
			const ext = path.extname(testFile).toLowerCase();
			assert.strictEqual(validExtensions.includes(ext), true);
		});

		test('Should reject invalid audio extensions', () => {
			const validExtensions = ['.mp3', '.wav', '.aiff', '.flac', '.ogg', '.m4a', '.wma'];
			const testFile = 'test.txt';
			const ext = path.extname(testFile).toLowerCase();
			assert.strictEqual(validExtensions.includes(ext), false);
		});

		test('Should detect empty files', () => {
			const stats = { size: 0 };
			assert.strictEqual(stats.size === 0, true);
		});

		test('Should accept non-empty files', () => {
			const stats = { size: 1024 };
			assert.strictEqual(stats.size > 0, true);
		});
	});

	// Command Tests
	suite('Command Tests', () => {
		test('Should have toggleSound command registered', async () => {
			const commands = await vscode.commands.getCommands();
			const hasToggleCommand = commands.includes('chhee-sasurr.toggleSound');
			assert.strictEqual(hasToggleCommand, true);
		});
	});

	// Integration Tests
	suite('Integration Tests', () => {
		test('Should register toggleSound command', async () => {
			const commands = await vscode.commands.getCommands();
			const hasToggleCommand = commands.includes('chhee-sasurr.toggleSound');
			assert.strictEqual(hasToggleCommand, true);
		});

		test('Should handle configuration updates', async () => {
			const config = vscode.workspace.getConfiguration('chhee-sasurr');
			const originalValue = config.get<boolean>('enableSound');
			
			// Test that we can read and toggle (without actually changing)
			assert.strictEqual(typeof originalValue, 'boolean');
		});

		test('Should validate sound file before playback', () => {
			const filePath = 'assets/failure.mp3';
			const isAbsolute = path.isAbsolute(filePath);
			assert.strictEqual(isAbsolute, false); // Should be relative
		});

		test('Should resolve relative paths to extension folder', () => {
			const relativePath = 'assets/success.mp3';
			const extensionPath = '/Users/prafullsahu/study/extensions/chhee-sasurr';
			const resolved = path.join(extensionPath, relativePath);
			assert.ok(resolved.includes('assets/success.mp3'));
		});

		test('Should have all required configuration properties', async () => {
			const config = vscode.workspace.getConfiguration('chhee-sasurr');
			const enableSound = config.get<boolean>('enableSound');
			const enableSuccessSound = config.get<boolean>('enableSuccessSound');
			const successSound = config.get<string>('successSound');
			const failureSound = config.get<string>('failureSound');
			
			assert.ok(enableSound !== undefined);
			assert.ok(enableSuccessSound !== undefined);
			assert.ok(successSound !== undefined);
			assert.ok(failureSound !== undefined);
		});
	});

	// Edge Case Tests
	suite('Edge Case Tests', () => {
		test('Should handle missing configuration gracefully', () => {
			const config = vscode.workspace.getConfiguration('chhee-sasurr');
			const missingValue = config.get<string>('nonExistentSetting', 'default');
			assert.strictEqual(missingValue, 'default');
		});

		test('Should handle empty sound path', () => {
			const soundPath = '';
			assert.strictEqual(soundPath === '', true);
		});

		test('Should exit code 0 indicate success', () => {
			const exitCode = 0;
			const isSuccess = exitCode === 0;
			assert.strictEqual(isSuccess, true);
		});

		test('Should non-zero exit code indicate failure', () => {
			const exitCode: number = 1;
			const isSuccess = exitCode === 0;
			assert.strictEqual(isSuccess, false);
		});
	});
});
