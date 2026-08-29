#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { argv, cwd, env, execPath } from 'node:process';

const command = argv[2];

if (!command || command === 'help' || command === '--help' || command === '-h') {
  await showHelp();
} else if (command === 'completion') {
  await showCompletion(argv[3]);
} else if (!/^[a-z][a-z0-9-]*$/.test(command)) {
  console.error(`不正な MAW コマンド名: ${command}`);
  console.error('小文字英数字とハイフンのみ使用できます。');
  process.exitCode = 1;
} else {
  await run(command);
}

async function projectContext() {
  const root = cwd();
  const config = JSON.parse(await fs.readFile(path.join(root, '.maw-addon.json'), 'utf8'));
  const repository = env.MAW_COMMANDS_REPOSITORY || config.commands?.repository;
  const ref = env.MAW_COMMANDS_REF || config.commands?.ref || 'main';
  const baseUrl = env.MAW_COMMANDS_BASE_URL
    || `https://raw.githubusercontent.com/${repository}/${ref}/scripts`;
  return { root, repository, ref, baseUrl, cacheDir: path.join(root, '.maw-tools') };
}

async function loadManifest() {
  const context = await projectContext();
  const cacheFile = path.join(context.cacheDir, 'commands.json');
  if (env.MAW_COMMANDS_OFFLINE !== '1') {
    try {
      const response = await fetch(`${context.baseUrl}/commands.json`, {
        headers: { 'user-agent': 'maw-addon-command-runner' },
        signal: AbortSignal.timeout(10_000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const manifest = await response.json();
      if (!Array.isArray(manifest.commands)) throw new Error('commands 配列がありません');
      await fs.mkdir(context.cacheDir, { recursive: true });
      await fs.writeFile(cacheFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
      return manifest;
    } catch {
      // ヘルプと補完はネットワーク障害時もキャッシュで動かす。
    }
  }
  try {
    return JSON.parse(await fs.readFile(cacheFile, 'utf8'));
  } catch {
    return { commands: [{ name: 'create-weapon', description: '武器アイテムを追加', options: ['--help'] }] };
  }
}

async function showHelp() {
  const manifest = await loadManifest();
  console.log('MAW アドオンコマンド');
  console.log('使い方: ./maw <コマンド> [オプション]\n');
  console.log('利用可能なコマンド:');
  for (const item of manifest.commands) {
    console.log(`  ${item.name.padEnd(20)} ${item.description || ''}`);
  }
  console.log('  help                 このヘルプを表示');
  console.log('  completion <shell>   補完スクリプトを出力 (zsh/bash/powershell)');
  console.log('\n詳細: ./maw <コマンド> --help');
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

async function showCompletion(shell) {
  const manifest = await loadManifest();
  const names = [...manifest.commands.map(item => item.name), 'help', 'completion'];
  const optionCases = manifest.commands.map(item =>
    `    ${item.name}) opts=${shellQuote((item.options || []).join(' '))} ;;`
  ).join('\n');
  if (shell === 'zsh') {
    const descriptions = manifest.commands.map(item => `${item.name}:${item.description || ''}`);
    console.log(`#compdef maw\n_maw() {\n  local -a commands\n  commands=(${descriptions.map(shellQuote).join(' ')})\n  if (( CURRENT == 2 )); then\n    _describe 'MAW command' commands\n    return\n  fi\n  local opts=''\n  case $words[2] in\n${optionCases}\n  esac\n  _values 'option' \${=opts}\n}\ncompdef _maw maw ./maw`);
  } else if (shell === 'bash') {
    console.log(`_maw() {\n  local cur=\"\${COMP_WORDS[COMP_CWORD]}\" opts=''\n  if [ \"$COMP_CWORD\" -eq 1 ]; then\n    COMPREPLY=( $(compgen -W \"${names.join(' ')}\" -- \"$cur\") )\n    return\n  fi\n  case \"\${COMP_WORDS[1]}\" in\n${optionCases}\n  esac\n  COMPREPLY=( $(compgen -W \"$opts\" -- \"$cur\") )\n}\ncomplete -F _maw maw ./maw`);
  } else if (shell === 'powershell') {
    const values = names.map(name => `'${name}'`).join(', ');
    console.log(`Register-ArgumentCompleter -Native -CommandName maw -ScriptBlock {\n  param($wordToComplete, $commandAst, $cursorPosition)\n  @(${values}) | Where-Object { $_ -like \"$wordToComplete*\" } | ForEach-Object {\n    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)\n  }\n}`);
  } else {
    console.error('shell を指定してください: ./maw completion zsh|bash|powershell');
    process.exitCode = 1;
  }
}

async function run(name) {
  const { root, repository, ref, baseUrl, cacheDir } = await projectContext();
  const commandArgs = argv.slice(3).filter(arg => arg !== '--offline');
  const offline = env.MAW_COMMANDS_OFFLINE === '1' || argv.slice(3).includes('--offline');
  const cacheFile = path.join(cacheDir, `${name}.mjs`);
  let script = cacheFile;

  if (!offline) {
    try {
      if (!repository && !env.MAW_COMMANDS_BASE_URL) throw new Error('commands.repository が未設定です');
      const response = await fetch(`${baseUrl}/${name}.mjs`, {
        headers: { 'user-agent': 'maw-addon-command-runner' },
        signal: AbortSignal.timeout(10_000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const source = await response.text();
      if (!source.startsWith('#!/usr/bin/env node')) throw new Error('取得内容が MAW コマンドではありません');
      await fs.mkdir(cacheDir, { recursive: true });
      await fs.writeFile(cacheFile, source, 'utf8');
      console.log(`[MAW] コマンドを更新しました (${repository || baseUrl}@${ref})`);
    } catch (error) {
      console.warn(`[MAW] 最新コマンドを取得できませんでした: ${error.message}`);
      try {
        await fs.access(cacheFile);
        console.warn('[MAW] キャッシュ済みコマンドを使用します。');
      } catch {
        throw new Error('最新版を取得できず、キャッシュもありません。ネットワーク接続後にもう一度実行してください。', { cause: error });
      }
    }
  } else {
    try {
      await fs.access(cacheFile);
    } catch {
      throw new Error('キャッシュがありません。先に npm run create-weapon をオンラインで実行してください。');
    }
    console.log('[MAW] オフライン: キャッシュ済みコマンドを使用します。');
  }

  const child = spawn(execPath, [script, ...commandArgs], {
    cwd: root,
    env,
    stdio: 'inherit'
  });
  const code = await new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', value => resolve(value ?? 1));
  });
  process.exitCode = code;
}
