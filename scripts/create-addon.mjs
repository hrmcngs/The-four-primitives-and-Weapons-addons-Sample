#!/usr/bin/env node
// MAW アドオン雛形ジェネレーター
//
// 使い方:
//   node scripts/create-addon.mjs [target-dir]
//   npm run create-addon -- [target-dir]
//
// このスクリプトは現在のリポジトリの構成をテンプレートとしてコピーし、
// modId / 作者 / Java パッケージ等を置換した新規アドオンプロジェクトを生成する。

import { promises as fs } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin, stdout, argv, exit, cwd } from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const TEMPLATE_ROOT = path.resolve(__dirname, '..');

// テンプレート側で使われている既定値（これを各フィールドに置換する）
const TEMPLATE = {
  modid:            'the_four_primitives_and_weapons_addons_sample',
  modidDashed:      'the-four-primitives-and-weapons-addons-sample',
  displayName:      'MAW Sample Addon',
  author:           'hiromichi-ngs',
  javaPackage:      'mawaddon',
  mainClass:        'MawSampleAddon',
  groupId:          'com.example.mawaddon',
  archivesBaseName: 'maw-sample-addon',
};

// コピー対象外（生成物・ローカル状態・隠しメタなど）
const EXCLUDES = new Set([
  '.git', '.gradle', 'build', 'run', 'bin', 'node_modules',
  '.maw-src', '.DS_Store',
  // 出力先がテンプレ内に作られた場合を弾く保険
  'docs/.vitepress/dist', 'docs/.vitepress/cache',
  // 本体MOD jar はユーザーが fetch-maw-jar で取り直すべきもの
  'libs/local',
  // npm 生成物
  'package-lock.json',
  // create-addon / create-weapon は生成後も再利用できるよう同梱する
]);

// 中身置換の対象外（バイナリ等）。拡張子で判定。
const BINARY_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico',
  '.jar', '.zip', '.gz', '.bin', '.class',
  '.ogg', '.mp3', '.wav',
]);

function isBinary(file) {
  return BINARY_EXTS.has(path.extname(file).toLowerCase());
}

function isExcluded(relPath) {
  const parts = relPath.split(path.sep);
  for (let i = 0; i < parts.length; i++) {
    if (EXCLUDES.has(parts[i])) return true;
    if (EXCLUDES.has(parts.slice(0, i + 1).join('/'))) return true;
  }
  return false;
}

async function prompt(rl, question, defaultValue) {
  const suffix = defaultValue ? ` [${defaultValue}]` : '';
  const ans = (await rl.question(`${question}${suffix}: `)).trim();
  return ans || defaultValue || '';
}

function validateModid(s) {
  if (!/^[a-z][a-z0-9_]{1,63}$/.test(s)) {
    throw new Error(`modId は小文字英数字とアンダースコアのみ（先頭は英字）: ${s}`);
  }
}

function validateJavaPackage(s) {
  if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/.test(s)) {
    throw new Error(`Java パッケージ名が不正: ${s}`);
  }
}

function validateClassName(s) {
  if (!/^[A-Z][A-Za-z0-9_]*$/.test(s)) {
    throw new Error(`クラス名は PascalCase で: ${s}`);
  }
}

function pascalCaseFromModid(modid) {
  return modid.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

// 文字列の全置換ヘルパー（テンプレ → ユーザー値）
function applyReplacements(text, cfg) {
  // 順番が大事: 長いキーから置換する（部分一致汚染を防ぐため）
  const pairs = [
    [TEMPLATE.modidDashed,      cfg.modidDashed],
    [TEMPLATE.modid,            cfg.modid],
    [TEMPLATE.displayName,      cfg.displayName],
    [TEMPLATE.author,           cfg.author],
    [TEMPLATE.mainClass,        cfg.mainClass],
    [TEMPLATE.groupId,          cfg.groupId],
    [TEMPLATE.archivesBaseName, cfg.archivesBaseName],
    [TEMPLATE.javaPackage,      cfg.javaPackage],
  ];
  let out = text;
  for (const [from, to] of pairs) {
    if (from === to) continue;
    out = out.split(from).join(to);
  }
  return out;
}

// Java パッケージ用にディレクトリパスを書き換える
// 例: src/main/java/mawaddon/foo.java → src/main/java/com/example/myaddon/foo.java
function rewritePath(relPath, cfg) {
  const fromDir = TEMPLATE.javaPackage.replace(/\./g, '/');
  const toDir   = cfg.javaPackage.replace(/\./g, '/');

  let p = relPath;

  // Java パッケージのディレクトリ置換（src/main/java 配下のみ）
  if (p.startsWith(`src/main/java/${fromDir}`)) {
    p = `src/main/java/${toDir}` + p.slice(`src/main/java/${fromDir}`.length);
  }

  // assets / data フォルダ名（modid）
  p = p.split(`assets/${TEMPLATE.modid}`).join(`assets/${cfg.modid}`);
  p = p.split(`data/${TEMPLATE.modid}`).join(`data/${cfg.modid}`);

  // メインクラスのファイル名（MawSampleAddon.java → <MainClass>.java）
  p = p.split(`/${TEMPLATE.mainClass}.java`).join(`/${cfg.mainClass}.java`);

  return p;
}

async function* walk(root, baseRel = '') {
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const e of entries) {
    const rel = baseRel ? `${baseRel}/${e.name}` : e.name;
    if (isExcluded(rel)) continue;
    const abs = path.join(root, e.name);
    if (e.isDirectory()) {
      yield* walk(abs, rel);
    } else if (e.isFile()) {
      yield { abs, rel };
    }
  }
}

const BOOL_FLAGS = new Set(['yes', 'y', 'help', 'h']);

function parseArgs(argv) {
  const out = { positional: [], flags: {} };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--') || a.startsWith('-')) {
      const raw = a.replace(/^-+/, '');
      const eq = raw.indexOf('=');
      if (eq >= 0) {
        out.flags[raw.slice(0, eq)] = raw.slice(eq + 1);
      } else if (BOOL_FLAGS.has(raw)) {
        out.flags[raw] = true;
      } else {
        out.flags[raw] = argv[++i] ?? '';
      }
    } else {
      out.positional.push(a);
    }
  }
  return out;
}

async function main() {
  const args = parseArgs(argv);
  const nonInteractive = args.flags.yes === true || args.flags.y === true;
  const rl = nonInteractive
    ? null
    : readline.createInterface({ input: stdin, output: stdout });
  let targetArg = args.positional[0] ?? args.flags.dir;

  console.log('=== MAW アドオン雛形ジェネレーター ===\n');

  const ask = async (key, question, defaultValue) => {
    if (args.flags[key] != null) return args.flags[key];
    if (nonInteractive) return defaultValue;
    return prompt(rl, question, defaultValue);
  };

  try {
    if (!targetArg) {
      targetArg = await ask('dir', '出力先ディレクトリ', '../my-maw-addon');
    }
    const target = path.resolve(cwd(), targetArg);

    // 既存ディレクトリチェック
    try {
      const st = await fs.stat(target);
      if (st.isDirectory()) {
        const entries = await fs.readdir(target);
        if (entries.length > 0) {
          throw new Error(`出力先 ${target} は空ではありません`);
        }
      }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    // 自分自身に書き出す事故を防ぐ
    if (path.resolve(target) === TEMPLATE_ROOT) {
      throw new Error('テンプレート自身の場所には書き出せません');
    }

    const modid       = await ask('modid', 'modId (小文字英数_)', 'my_maw_addon');
    validateModid(modid);

    const displayName = await ask('name', '表示名 (mods.toml displayName)', 'My MAW Addon');
    const author      = await ask('author', '作者名', 'your-name');
    const groupId     = await ask('group', 'Maven group (Java パッケージのルート)', `com.example.${modid}`);
    validateJavaPackage(groupId);

    const javaPackage = await ask('package', 'Java パッケージ (完全修飾)', groupId);
    validateJavaPackage(javaPackage);

    const mainClass   = await ask('class', 'メインクラス名 (PascalCase)', pascalCaseFromModid(modid));
    validateClassName(mainClass);

    const archivesBaseName = await ask('archive', 'JAR ファイル名 (archivesBaseName)', modid.replace(/_/g, '-'));

    const modidDashed = modid.replace(/_/g, '-');
    const cfg = { modid, modidDashed, displayName, author, groupId, javaPackage, mainClass, archivesBaseName };

    console.log('\n--- 設定 ---');
    for (const [k, v] of Object.entries(cfg)) console.log(`  ${k.padEnd(18)} : ${v}`);
    if (!nonInteractive) {
      const ok = await prompt(rl, '\nこの設定で生成しますか? (y/N)', 'N');
      if (!/^y(es)?$/i.test(ok)) {
        console.log('中止しました。');
        exit(1);
      }
    }

    await fs.mkdir(target, { recursive: true });

    let copied = 0;
    for await (const { abs, rel } of walk(TEMPLATE_ROOT)) {
      const newRel = rewritePath(rel, cfg);
      const dest = path.join(target, newRel);
      await fs.mkdir(path.dirname(dest), { recursive: true });

      if (isBinary(rel)) {
        await fs.copyFile(abs, dest);
      } else {
        const buf = await fs.readFile(abs, 'utf8');
        const replaced = applyReplacements(buf, cfg);
        await fs.writeFile(dest, replaced);
      }
      copied++;
    }

    // 不要なローカル成果物をテンプレ由来で消す（package-lock など書き出されたら消す）
    // ※ EXCLUDES に挙げているので通常は来ないが、保険的に。

    console.log(`\n[完了] ${copied} 個のファイルを ${target} に生成しました。`);
    console.log('\n次の手順:');
    console.log(`  cd ${path.relative(cwd(), target) || '.'}`);
    console.log('  bash scripts/fetch-maw-jar.sh   # 本体MOD jar の取り込み (任意)');
    console.log('  ./gradlew build');
  } catch (e) {
    console.error(`\nエラー: ${e.message}`);
    exit(1);
  } finally {
    rl?.close();
  }
}

main();
