import { spawnSync } from 'node:child_process';

const Color = {
  reset: '\u001b[0m',
  gray: '\u001b[90m',
  cyan: '\u001b[36m',
  red: '\u001b[1;31m',
};

const log = {
  error: (message: string) => {
    console.log(`${Color.red}Error: ${message}${Color.reset}`);
  },
  ok: (message: string) => {
    console.log(`${Color.cyan}Ok: ${message}${Color.reset}`);
  },
  plain: (message: string) => {
    console.log(`${Color.gray}Log: ${message}${Color.reset}`);
  },
};

function isBrewInstalled() {
  log.plain('Checking if brew is installed');
  const installed = /homebrew \d+.\d+.\d+/i.test(
    spawnSync('brew', ['--version']).stdout.toString().trim(),
  );
  if (!installed) {
    log.error("brew isn't installed");
    return false;
  }
  log.ok('brew is installed');
  return true;
}

function searchNerdFonts() {
  log.plain('Searching nerd fonts');
  const fonts = spawnSync('brew', ['search', '/font-.*-nerd-font/'])
    .stdout.toString()
    .trim()
    .split('\n')
    .filter(Boolean);
  log.ok(`Found ${fonts.length} nerd fonts`);
  return fonts;
}

function installNerdFonts() {
  const fonts = searchNerdFonts();

  if (!fonts.length) {
    log.plain('Nothing to install');
    return;
  }

  for (const font of fonts) {
    log.plain(`Installing '${font}'`);
    const { status } = spawnSync('brew', [
      'install',
      '--cask',
      font,
      ...(isDev() ? ['--dry-run'] : []),
    ]);
    if (status !== 0) {
      log.error(`'${font}' installation failed`);
    } else {
      log.ok(`'${font}' installed successfully`);
    }
  }

  log.plain('Finished installing');
}

function isDev() {
  return process.env.NODE_ENV === 'dev';
}

export function bulkNerdFonts() {
  if (isDev()) {
    log.ok('Running with --dry-run');
  }
  try {
    if (!isBrewInstalled()) {
      return;
    }
    installNerdFonts();
  } catch (error) {
    log.error(error);
  }
}
