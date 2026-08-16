# Blade textures

刀身テクスチャは武器種ごとのサブディレクトリに置きます。

サブディレクトリは次の4種類です。

- `blade/dagger`: ダガー
- `blade/katana`: 刀
- `blade/rapier`: 細剣
- `blade/tyokuto`: 直刀

例: `blade/rapier/sample_rapier.png`

モデルでは拡張子を除いて次のように参照します。

```json
"0": "the_four_primitives_and_weapons_addons_sample:blade/rapier/sample_rapier"
```

このサンプルは構成を最小に保つため、各武器とも本体MODの鉄系テクスチャを参照しています。
