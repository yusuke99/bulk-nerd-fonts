import type { SpawnSyncReturns } from 'node:child_process';
import { spawnSync } from 'node:child_process';
import { expect, test, vi } from 'vitest';
import { bulkNerdFonts } from './bulk-nerd-fonts';

vi.mock('node:child_process', () => ({
  spawnSync: vi.fn(
    (_command: string, args: string[]): SpawnSyncReturns<Buffer> => {
      if (args[0] === '--version') {
        const stdout = Buffer.from('Homebrew 1.2.3');
        const stderr = Buffer.from('');
        return {
          pid: 0,
          output: [null, stdout, stderr],
          stdout,
          stderr,
          status: 0,
          signal: null,
          error: undefined,
        };
      }

      if (args[0] === 'search') {
        const stdout = Buffer.from(
          [
            'font-jetbrains-mono-nerd-font',
            'font-geist-mono-nerd-font',
            'font-caskaydia-mono-nerd-font',
          ].join('\n'),
        );
        const stderr = Buffer.from('');
        return {
          pid: 0,
          output: [null, stdout, stderr],
          stdout,
          stderr,
          status: 0,
          signal: null,
          error: undefined,
        };
      }

      return {
        pid: 0,
        output: [null, Buffer.from(''), Buffer.from('')],
        stdout: Buffer.from(''),
        stderr: Buffer.from(''),
        status: 0,
        signal: null,
        error: undefined,
      };
    },
  ),
}));

test('bulk-nerd-fonts', () => {
  const mockSpawnSync = vi.mocked(spawnSync);

  bulkNerdFonts();

  // biome-ignore format: ignore
  expect(mockSpawnSync.mock.calls).toStrictEqual([
    ['brew', ['--version']],
    ['brew', ['search', '/font-.*-nerd-font/']],
    ['brew', ['install', '--cask', 'font-jetbrains-mono-nerd-font', '--dry-run']],
    ['brew', ['install', '--cask', 'font-geist-mono-nerd-font', '--dry-run']],
    ['brew', ['install', '--cask', 'font-caskaydia-mono-nerd-font', '--dry-run']],
  ]);
});
