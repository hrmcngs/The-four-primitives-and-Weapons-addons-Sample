#!/usr/bin/env node
// MAW 武器追加ジェネレーター
// npm run create-weapon -- --type katana --id moon_katana --name 月光刀 --name-en "Moon Katana" --creative-tab minecraft:combat --blade-color gray --tsuka-color red --tsuba-color gray --kasira-color black

import { promises as fs } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { argv, cwd, stdin, stdout } from 'node:process';

const MODID = 'the_four_primitives_and_weapons_addons_sample';
const JAVA_PACKAGE = 'mawaddon';
const ROOT = cwd();
const IRON_BLADE_TEXTURES = {
  dagger: 'iron_dagger',
  katana: 'katanairon3d',
  rapier: 'iron_rapier',
  tyokuto: 'iron_tyokuto3d'
};
const NAMED_COLORS = {
  black: 0x000000, dark_blue: 0x0000aa, dark_green: 0x00aa00, dark_aqua: 0x00aaaa,
  dark_red: 0xaa0000, dark_purple: 0xaa00aa, gold: 0xffaa00, gray: 0x808080,
  dark_gray: 0x555555, blue: 0x0000ff, green: 0x00ff00, aqua: 0x00ffff,
  red: 0xff0000, light_purple: 0xff55ff, yellow: 0xffff00, white: 0xffffff,
  orange: 0xffa500, pink: 0xffc0cb, purple: 0x800080, brown: 0x8b4513,
  cyan: 0x00ffff, lime: 0x00ff00, magenta: 0xff00ff, navy: 0x000080,
  teal: 0x008080, olive: 0x808000, silver: 0xc0c0c0, maroon: 0x800000,
  赤: 0xff0000, 青: 0x0000ff, 緑: 0x00ff00, 黄: 0xffff00,
  白: 0xffffff, 黒: 0x000000, 灰: 0x808080, 紫: 0x800080,
  桃: 0xffc0cb, 橙: 0xffa500, 水色: 0x00ffff, 茶: 0x8b4513
};

const WEAPONS = {
  dagger: {
    label: 'ダガー', labelEn: 'Dagger', typeId: 'dagger', damage: 2, speed: -1.2,
    parent: 'the_four_primitives_and_weapons:custom/weapon/dagger/dagger_parent',
    textures: { '1': 'the_four_primitives_and_weapons:dagger_fitting/tuba/tuba', '2': 'the_four_primitives_and_weapons:dagger_fitting/grip/grip', '3': 'the_four_primitives_and_weapons:blade/dagger/iron_dagger', particle: 'the_four_primitives_and_weapons:blade/dagger/iron_dagger' }
  },
  katana: {
    label: '刀', labelEn: 'Katana', typeId: 'katana', damage: 3, speed: -2.4,
    parent: 'the_four_primitives_and_weapons:custom/weapon/katana/katana_a_parent',
    textures: { '0': 'the_four_primitives_and_weapons:blade/katana/katanairon3d', '1': 'the_four_primitives_and_weapons:katana_fitting/tsuba/tuba_black', '3': 'the_four_primitives_and_weapons:katana_fitting/kasira/kasira_black', '4': 'the_four_primitives_and_weapons:katana_fitting/tsuka/tuka_black', particle: 'the_four_primitives_and_weapons:blade/katana/katanairon3d' }
  },
  rapier: {
    label: '細剣', labelEn: 'Rapier', typeId: 'rapier', damage: 2, speed: -1.8,
    parent: 'the_four_primitives_and_weapons:custom/weapon/rapier/rapier_parent',
    textures: { '0': 'the_four_primitives_and_weapons:blade/rapier/iron_rapier', '1': 'the_four_primitives_and_weapons:rapier_fitting/grip/iron_grip', '2': 'the_four_primitives_and_weapons:rapier_fitting/guard/iron_guard', '3': 'the_four_primitives_and_weapons:rapier_fitting/pommel/iron_pommel', particle: 'the_four_primitives_and_weapons:blade/rapier/iron_rapier' }
  },
  tyokuto: {
    label: '直刀', labelEn: 'Straight Sword', typeId: 'straight_sword', damage: 3, speed: -2.4,
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

function normalizeItemId(value) {
  return value.trim().replace(/[\s\u3000]+/g, '_');
}

function creativeTabId(value) {
  const id = value.includes(':') ? value : `minecraft:${value}`;
  if (!/^[a-z0-9_.-]+:[a-z0-9_./-]+$/.test(id)) throw new Error(`不正なクリエイティブタブID: ${value}`);
  return id;
}

function bladeTexture(kind) {
  return `the_four_primitives_and_weapons:blade/${kind}/${IRON_BLADE_TEXTURES[kind]}`;
}

function parseColor(value, part) {
  const normalized = value.trim().toLowerCase().replace(/[ -]+/g, '_');
  if (Object.hasOwn(NAMED_COLORS, normalized)) return NAMED_COLORS[normalized];
  let hex = normalized.replace(/^#/, '').replace(/^0x/, '');
  if (/^[0-9a-f]{3}$/.test(hex)) hex = [...hex].map(char => char + char).join('');
  if (/^[0-9a-f]{6}$/.test(hex)) return Number.parseInt(hex, 16);
  throw new Error(`不正な${part}の色: ${value} (色名または #RRGGBB で指定してください)`);
}

function parseBladeColor(value) {
  // 通常のironテクスチャそのものを gray として扱い、乗算色は白（無変化）にする。
  return value.trim().toLowerCase() === 'gray' ? 0xffffff : parseColor(value, '刀身');
}

function colorJava(colors) {
  const setters = Object.entries(colors)
    .map(([method, color]) => `        if (!tag.contains(KatanaFittings.${method === 'Kashira' ? 'KASHIRA' : method.toUpperCase()}_KEY, Tag.TAG_INT)) {\n            KatanaFittings.set${method}(stack, 0x${color.toString(16).padStart(6, '0').toUpperCase()});\n        }`)
    .join('\n');
  return `\n    private static void applyDefaultColors(ItemStack stack) {\n        CompoundTag tag = stack.getOrCreateTag();\n${setters}\n    }\n\n    @Override\n    public ItemStack getDefaultInstance() {\n        ItemStack stack = super.getDefaultInstance();\n        applyDefaultColors(stack);\n        return stack;\n    }\n\n    @Override\n    public void inventoryTick(ItemStack stack, Level level, Entity entity, int slot, boolean selected) {\n        applyDefaultColors(stack);\n        super.inventoryTick(stack, level, entity, slot, selected);\n    }\n`;
}

function sayaParent(kind) {
  return `the_four_primitives_and_weapons:custom/saya/${kind}/saya_iron_${kind}`;
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
    const rawId = await ask('id', 'アイテムID', `my_${kind}`);
    const id = normalizeItemId(rawId);
    if (id !== rawId) console.log(`アイテムIDを ${id} に変換しました。`);
    if (!/^[a-z][a-z0-9_]*$/.test(id)) throw new Error(`不正なアイテムID: ${id}`);
    const ja = await ask('name', '日本語名', `マイ${spec.label}`);
    const en = await ask('name-en', '英語名', `My ${spec.labelEn}`);
    const creativeTab = creativeTabId(await ask('creative-tab', 'クリエイティブタブID', 'minecraft:combat'));
    const bladeColor = parseBladeColor(await ask('blade-color', '刀身の色 (gray/色名/#RRGGBB)', 'gray'));
    const blade = bladeTexture(kind);
    let textures = { ...spec.textures, particle: blade };
    const fittingColors = { Blade: bladeColor };
    if (kind === 'katana') {
      fittingColors.Tsuka = parseColor(await ask('tsuka-color', '柄の色 (色名/#RRGGBB)', 'black'), '柄');
      fittingColors.Tsuba = parseColor(await ask('tsuba-color', '鍔の色 (色名/#RRGGBB)', 'black'), '鍔');
      fittingColors.Kashira = parseColor(await ask('kasira-color', '頭の色 (色名/#RRGGBB)', 'black'), '頭');
      textures = {
        '0': blade,
        '1': 'the_four_primitives_and_weapons:katana_fitting/tsuba/tuba',
        '3': 'the_four_primitives_and_weapons:katana_fitting/kasira/kasira',
        '4': 'the_four_primitives_and_weapons:katana_fitting/tsuka/tuka',
        particle: blade
      };
    } else if (kind === 'dagger') {
      fittingColors.Tsuba = parseColor(await ask('tsuba-color', '鍔の色 (色名/#RRGGBB)', 'black'), '鍔');
      fittingColors.Tsuka = parseColor(await ask('grip-color', '柄の色 (色名/#RRGGBB)', 'black'), '柄');
      textures = { '1': 'the_four_primitives_and_weapons:dagger_fitting/tuba/tuba', '2': 'the_four_primitives_and_weapons:dagger_fitting/grip/grip', '3': blade, particle: blade };
    } else if (kind === 'rapier') {
      fittingColors.Tsuka = parseColor(await ask('grip-color', '柄の色 (色名/#RRGGBB)', 'black'), '柄');
      fittingColors.Tsuba = parseColor(await ask('guard-color', '護拳の色 (色名/#RRGGBB)', 'black'), '護拳');
      fittingColors.Kashira = parseColor(await ask('pommel-color', '柄頭の色 (色名/#RRGGBB)', 'black'), '柄頭');
      textures = { '0': blade, '1': 'the_four_primitives_and_weapons:rapier_fitting/grip/iron_grip', '2': 'the_four_primitives_and_weapons:rapier_fitting/guard/iron_guard', '3': 'the_four_primitives_and_weapons:rapier_fitting/pommel/iron_pommel', particle: blade };
    } else if (kind === 'tyokuto') {
      fittingColors.Tsuka = parseColor(await ask('tsuka-color', '柄の色 (色名/#RRGGBB)', 'black'), '柄');
      fittingColors.Tsuba = parseColor(await ask('tsuba-color', '鍔の色 (色名/#RRGGBB)', 'black'), '鍔');
      fittingColors.Kashira = parseColor(await ask('kasira-color', '頭の色 (色名/#RRGGBB)', 'black'), '頭');
      textures = { '1': blade, '3': 'the_four_primitives_and_weapons:straight_katana_fitting/tsuba/tuba', '4': 'the_four_primitives_and_weapons:straight_katana_fitting/kasira/kasira', '6': 'the_four_primitives_and_weapons:straight_katana_fitting/tsuka/tuka', particle: blade };
    }
    const cls = className(id);
    const javaDir = path.join(ROOT, 'src/main/java', ...JAVA_PACKAGE.split('.'));
    const assets = path.join(ROOT, 'src/main/resources/assets', MODID);
    const data = path.join(ROOT, 'src/main/resources/data', MODID);
    const javaFile = path.join(javaDir, 'item', `${cls}.java`);
    const modelFile = path.join(assets, 'models/item', `${id}.json`);
    await assertMissing(javaFile); await assertMissing(modelFile);

    const java = `package ${JAVA_PACKAGE}.item;\n\nimport the_four_primitives_and_weapons.util.KatanaFittings;\nimport net.minecraft.nbt.CompoundTag;\nimport net.minecraft.nbt.Tag;\nimport net.minecraft.world.entity.Entity;\nimport net.minecraft.world.item.*;\nimport net.minecraft.world.item.crafting.Ingredient;\nimport net.minecraft.world.level.Level;\n\npublic class ${cls} extends SwordItem {\n    public ${cls}() {\n        super(new Tier() {\n            public int getUses() { return 250; }\n            public float getSpeed() { return 6.0f; }\n            public float getAttackDamageBonus() { return 2.0f; }\n            public int getLevel() { return 2; }\n            public int getEnchantmentValue() { return 14; }\n            public Ingredient getRepairIngredient() { return Ingredient.of(); }\n        }, ${spec.damage}, ${spec.speed}f, new Item.Properties().rarity(Rarity.UNCOMMON));\n    }\n${colorJava(fittingColors)}}\n`;
    await fs.writeFile(javaFile, java);
    await writeJson(modelFile, { parent: spec.parent, textures });

    const sayaModelPath = `custom/saya/${kind}/saya_${id}`;
    const sayaModelFile = path.join(assets, 'models', `${sayaModelPath}.json`);
    const sayaRegistryFile = path.join(data, 'maw_saya', `${id}.json`);
    await fs.mkdir(path.dirname(sayaModelFile), { recursive: true });
    await fs.mkdir(path.dirname(sayaRegistryFile), { recursive: true });
    await assertMissing(sayaModelFile); await assertMissing(sayaRegistryFile);
    await writeJson(sayaModelFile, { parent: sayaParent(kind) });
    await writeJson(sayaRegistryFile, { [kind]: { [`${MODID}:${id}`]: `${MODID}:${sayaModelPath}` } });

    const registryFile = path.join(javaDir, 'init/AddonItems.java');
    let registry = await fs.readFile(registryFile, 'utf8');
    registry = registry.replace('import mawaddon.MawSampleAddon;', `import mawaddon.MawSampleAddon;\nimport ${JAVA_PACKAGE}.item.${cls};`);
    registry = registry.replace('    // ここに新しいアイテムを追加してください', `    public static final RegistryObject<Item> ${id.toUpperCase()} =\n        REGISTRY.register("${id}", ${cls}::new);\n\n    // ここに新しいアイテムを追加してください`);
    await fs.writeFile(registryFile, registry);

    const creativeTabsFile = path.join(javaDir, 'init/AddonCreativeTabs.java');
    let creativeTabs = await fs.readFile(creativeTabsFile, 'utf8');
    creativeTabs = creativeTabs.replace('        // ここに新しいクリエイティブタブ項目を追加してください', `        if (isTab(event, "${creativeTab}")) event.accept(AddonItems.${id.toUpperCase()}.get().getDefaultInstance());\n\n        // ここに新しいクリエイティブタブ項目を追加してください`);
    await fs.writeFile(creativeTabsFile, creativeTabs);

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
    console.log(`鞘対応: ${path.relative(ROOT, sayaRegistryFile)} を追加しました。`);
    console.log(`次は ${path.relative(ROOT, modelFile)} の textures を独自PNGへ変更できます。`);
  } finally { rl.close(); }
}

main().catch(error => { console.error(`エラー: ${error.message}`); process.exitCode = 1; });
