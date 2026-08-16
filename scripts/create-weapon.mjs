#!/usr/bin/env node
// MAW 武器追加ジェネレーター
// npm run create-weapon -- --type katana --id moon_katana --name 月光刀 --name-en "Moon Katana"

import { promises as fs } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { argv, cwd, stdin, stdout } from 'node:process';

const MODID = 'the_four_primitives_and_weapons_addons_sample';
const JAVA_PACKAGE = 'mawaddon';
const ROOT = cwd();

const WEAPONS = {
  dagger: {
    label: 'ダガー', typeId: 'dagger', damage: 2, speed: -1.2,
    parent: 'the_four_primitives_and_weapons:custom/weapon/dagger/dagger_parent',
    textures: { '1': 'the_four_primitives_and_weapons:dagger_fitting/tuba/tuba', '2': 'the_four_primitives_and_weapons:dagger_fitting/grip/grip', '3': 'the_four_primitives_and_weapons:blade/dagger/iron_dagger', particle: 'the_four_primitives_and_weapons:blade/dagger/iron_dagger' }
  },
  katana: {
    label: '刀', typeId: 'katana', damage: 3, speed: -2.4,
    parent: 'the_four_primitives_and_weapons:custom/weapon/katana/katana_a_parent',
    textures: { '0': 'the_four_primitives_and_weapons:blade/katana/katanairon3d', '1': 'the_four_primitives_and_weapons:katana_fitting/tsuba/tuba_black', '3': 'the_four_primitives_and_weapons:katana_fitting/kasira/kasira_black', '4': 'the_four_primitives_and_weapons:katana_fitting/tsuka/tuka_black', particle: 'the_four_primitives_and_weapons:blade/katana/katanairon3d' }
  },
  rapier: {
    label: '細剣', typeId: 'rapier', damage: 2, speed: -1.8,
    parent: 'the_four_primitives_and_weapons:custom/weapon/rapier/rapier_parent',
    textures: { '0': 'the_four_primitives_and_weapons:blade/rapier/iron_rapier', '1': 'the_four_primitives_and_weapons:rapier_fitting/grip/iron_grip', '2': 'the_four_primitives_and_weapons:rapier_fitting/guard/iron_guard', '3': 'the_four_primitives_and_weapons:rapier_fitting/pommel/iron_pommel', particle: 'the_four_primitives_and_weapons:blade/rapier/iron_rapier' }
  },
  tyokuto: {
    label: '直刀', typeId: 'straight_sword', damage: 3, speed: -2.4,
    parent: 'the_four_primitives_and_weapons:custom/weapon/tyokuto/tyokuto_b_parent',
    textures: { '1': 'the_four_primitives_and_weapons:blade/tyokuto/iron_tyokuto3d', '3': 'the_four_primitives_and_weapons:straight_katana_fitting/tsuba/tuba', '4': 'the_four_primitives_and_weapons:straight_katana_fitting/kasira/kasira', '6': 'the_four_primitives_and_weapons:straight_katana_fitting/tsuka/tuka', particle: 'the_four_primitives_and_weapons:blade/tyokuto/iron_tyokuto3d' }
  }
};

function argsMap() {
  const out = {};
  for (let i = 2; i < argv.length; i++) if (argv[i].startsWith('--')) out[argv[i].slice(2)] = argv[++i] ?? '';
  return out;
}

function className(id) {
  return id.split('_').map(part => part[0].toUpperCase() + part.slice(1)).join('') + 'Item';
}

async function readJson(file) { return JSON.parse(await fs.readFile(file, 'utf8')); }
async function writeJson(file, value) { await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`); }
async function assertMissing(file) {
  try { await fs.access(file); throw new Error(`既に存在します: ${path.relative(ROOT, file)}`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}

async function main() {
  const flags = argsMap();
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const ask = async (key, text, fallback = '') => flags[key] || (await rl.question(`${text}${fallback ? ` [${fallback}]` : ''}: `)).trim() || fallback;
  try {
    const kind = await ask('type', '武器種 (dagger/katana/rapier/tyokuto)', 'katana');
    const spec = WEAPONS[kind];
    if (!spec) throw new Error(`未対応の武器種: ${kind}`);
    const id = await ask('id', 'アイテムID', `my_${kind}`);
    if (!/^[a-z][a-z0-9_]*$/.test(id)) throw new Error(`不正なアイテムID: ${id}`);
    const ja = await ask('name', '日本語名', `マイ${spec.label}`);
    const en = await ask('name-en', '英語名', `My ${spec.label}`);
    const cls = className(id);
    const javaDir = path.join(ROOT, 'src/main/java', ...JAVA_PACKAGE.split('.'));
    const assets = path.join(ROOT, 'src/main/resources/assets', MODID);
    const data = path.join(ROOT, 'src/main/resources/data', MODID);
    const javaFile = path.join(javaDir, 'item', `${cls}.java`);
    const modelFile = path.join(assets, 'models/item', `${id}.json`);
    await assertMissing(javaFile); await assertMissing(modelFile);

    const java = `package ${JAVA_PACKAGE}.item;\n\nimport net.minecraft.world.item.*;\nimport net.minecraft.world.item.crafting.Ingredient;\n\npublic class ${cls} extends SwordItem {\n    public ${cls}() {\n        super(new Tier() {\n            public int getUses() { return 250; }\n            public float getSpeed() { return 6.0f; }\n            public float getAttackDamageBonus() { return 2.0f; }\n            public int getLevel() { return 2; }\n            public int getEnchantmentValue() { return 14; }\n            public Ingredient getRepairIngredient() { return Ingredient.of(); }\n        }, ${spec.damage}, ${spec.speed}f, new Item.Properties().rarity(Rarity.UNCOMMON));\n    }\n}\n`;
    await fs.writeFile(javaFile, java);
    await writeJson(modelFile, { parent: spec.parent, textures: spec.textures });

    const registryFile = path.join(javaDir, 'init/AddonItems.java');
    let registry = await fs.readFile(registryFile, 'utf8');
    registry = registry.replace('import mawaddon.MawSampleAddon;', `import mawaddon.MawSampleAddon;\nimport ${JAVA_PACKAGE}.item.${cls};`);
    registry = registry.replace('    // ここに新しいアイテムを追加してください', `    public static final RegistryObject<Item> ${id.toUpperCase()} =\n        REGISTRY.register("${id}", ${cls}::new);\n\n    // ここに新しいアイテムを追加してください`);
    await fs.writeFile(registryFile, registry);

    for (const [locale, name] of [['ja_jp', ja], ['en_us', en]]) {
      const file = path.join(assets, 'lang', `${locale}.json`);
      const json = await readJson(file); json[`item.${MODID}.${id}`] = name; await writeJson(file, json);
    }
    const typeFile = path.join(data, 'weapon_types/weapon_types.json');
    const types = await readJson(typeFile);
    types.types[spec.typeId] ??= { display_name: spec.label, items: [] };
    types.types[spec.typeId].items ??= [];
    types.types[spec.typeId].items.push(`${MODID}:${id}`);
    await writeJson(typeFile, types);

    const statsFile = path.join(data, 'weapon_stats/weapon_stats.json');
    const stats = await readJson(statsFile);
    stats.weapons[`${MODID}:${id}`] = { durability: 250, enchantability: 14, damage_bonus: spec.damage };
    await writeJson(statsFile, stats);
    console.log(`\n完了: ${MODID}:${id} (${kind}) を追加しました。`);
    console.log(`次は ${path.relative(ROOT, modelFile)} の textures を独自PNGへ変更してください。`);
  } finally { rl.close(); }
}

main().catch(error => { console.error(`エラー: ${error.message}`); process.exitCode = 1; });
