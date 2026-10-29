import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
// docs/create-addon.md
var __pageData = JSON.parse("{\"title\":\"アドオン雛形ジェネレーター\",\"description\":\"\",\"frontmatter\":{},\"headers\":[],\"relativePath\":\"create-addon.md\",\"filePath\":\"create-addon.md\"}");
var _sfc_main = { name: "create-addon.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="アドオン雛形ジェネレーター" tabindex="-1">アドオン雛形ジェネレーター <a class="header-anchor" href="#アドオン雛形ジェネレーター" aria-label="Permalink to “アドオン雛形ジェネレーター”">​</a></h1><p>このリポジトリと同じ構成の MAW アドオンプロジェクトをターミナルから一発で生成できます。</p><h2 id="使い方" tabindex="-1">使い方 <a class="header-anchor" href="#使い方" aria-label="Permalink to “使い方”">​</a></h2><h3 id="対話モード-推奨" tabindex="-1">対話モード（推奨） <a class="header-anchor" href="#対話モード-推奨" aria-label="Permalink to “対話モード（推奨）”">​</a></h3><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">npm</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> run</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> create-addon</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#62687b",
		"--shiki-dark": "#818e99"
	})}"># または</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">node</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> scripts/create-addon.mjs</span></span></code></pre></div><p>modId・表示名・作者・Java パッケージなどを 1 つずつ聞かれます。Enter キーで <code>[ ]</code> 内の既定値が使われます。</p><h3 id="非対話モード-ci-スクリプト用" tabindex="-1">非対話モード（CI / スクリプト用） <a class="header-anchor" href="#非対話モード-ci-スクリプト用" aria-label="Permalink to “非対話モード（CI / スクリプト用）”">​</a></h3><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">node</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> scripts/create-addon.mjs</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> ../my-addon</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --yes</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --modid</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> my_cool_addon</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --name</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &quot;My Cool Addon&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --author</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> your-name</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --group</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> com.example.mycool</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --package</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> com.example.mycool</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --class</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> MyCoolAddon</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --archive</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> my-cool-addon</span></span></code></pre></div><h2 id="オプション一覧" tabindex="-1">オプション一覧 <a class="header-anchor" href="#オプション一覧" aria-label="Permalink to “オプション一覧”">​</a></h2><table tabindex="0"><thead><tr><th>フラグ</th><th>説明</th><th>既定値</th></tr></thead><tbody><tr><td><code>&lt;dir&gt;</code> (位置引数)</td><td>出力先ディレクトリ</td><td><code>../my-maw-addon</code></td></tr><tr><td><code>--yes</code> / <code>-y</code></td><td>確認プロンプトをスキップ</td><td><code>false</code></td></tr><tr><td><code>--modid</code></td><td>modId（小文字英数 + <code>_</code>）</td><td><code>my_maw_addon</code></td></tr><tr><td><code>--name</code></td><td>mods.toml の <code>displayName</code></td><td><code>My MAW Addon</code></td></tr><tr><td><code>--author</code></td><td>作者名</td><td><code>your-name</code></td></tr><tr><td><code>--group</code></td><td>Maven group ID</td><td><code>com.example.&lt;modid&gt;</code></td></tr><tr><td><code>--package</code></td><td>Java の完全修飾パッケージ</td><td><code>--group</code> と同じ</td></tr><tr><td><code>--class</code></td><td>メインクラス名（PascalCase）</td><td>modId を PascalCase 化</td></tr><tr><td><code>--archive</code></td><td>JAR ファイル名（archivesBaseName）</td><td>modId をダッシュ区切り化</td></tr></tbody></table><h2 id="自動置換される項目" tabindex="-1">自動置換される項目 <a class="header-anchor" href="#自動置換される項目" aria-label="Permalink to “自動置換される項目”">​</a></h2><ul><li><code>modId</code>（スネーク・ダッシュ両形式）</li><li>表示名 / 作者名</li><li>Java パッケージ + ディレクトリ構造（例: <code>mawaddon/</code> → <code>com/example/yourpkg/</code>）</li><li>メインクラス名（ファイル名も含む）</li><li><code>assets/&lt;modid&gt;/</code> および <code>data/&lt;modid&gt;/</code> のフォルダ名</li><li><code>build.gradle</code> の <code>group</code> と <code>archivesBaseName</code></li><li><code>package.json</code> の <code>name</code></li></ul><h2 id="除外されるもの" tabindex="-1">除外されるもの <a class="header-anchor" href="#除外されるもの" aria-label="Permalink to “除外されるもの”">​</a></h2><ul><li><code>.git/</code>, <code>.gradle/</code>, <code>build/</code>, <code>run/</code>, <code>bin/</code>, <code>node_modules/</code></li><li><code>libs/local/</code>（本体MOD jar — <code>scripts/fetch-maw-jar.sh</code> で取り直す）</li><li><code>package-lock.json</code>（<code>npm install</code> で再生成）</li><li>コマンドランナーだけが生成先に含まれ、武器生成コマンド本体は含まれません</li></ul><h2 id="コマンドの更新方法" tabindex="-1">コマンドの更新方法 <a class="header-anchor" href="#コマンドの更新方法" aria-label="Permalink to “コマンドの更新方法”">​</a></h2><p><code>npm run create-weapon</code> は、実行時に専用の <code>hrmcngs/The-four-primitives-and-Weapons-addon-commands</code> リポジトリから最新版を取得し、<code>.maw-tools/</code> にキャッシュしてから実行します。コマンド本体はこのテンプレートに置かないため、GitHub の「Use this template」で作ったリポジトリにはコピーされません。生成済みアドオンを作り直さなくても武器生成コマンドの更新を利用できます。</p><p>ネットワークに接続できない場合は、前回取得したキャッシュへ自動的に切り替わります。初回だけはオンラインでの取得が必要です。明示的に通信せず実行する場合は次を使います。</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">npm</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> run</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> create-weapon:offline</span></span></code></pre></div><p>取得元とブランチは <code>.maw-addon.json</code> の <code>commands.repository</code> / <code>commands.ref</code> で固定できます。一時的に変更する場合は <code>MAW_COMMANDS_REPOSITORY</code>、<code>MAW_COMMANDS_REF</code>、<code>MAW_COMMANDS_BASE_URL</code> 環境変数も利用できます。</p><h3 id="新しいコマンドの追加" tabindex="-1">新しいコマンドの追加 <a class="header-anchor" href="#新しいコマンドの追加" aria-label="Permalink to “新しいコマンドの追加”">​</a></h3><p>コマンド専用リポジトリへ <code>scripts/&lt;コマンド名&gt;.mjs</code> を追加すると、すでに Use template で作成済みのリポジトリからも次の形式で実行できます。</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">./maw</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> &lt;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">コマンド</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">名</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">&gt;</span></span></code></pre></div><p>コマンド名には小文字英数字とハイフンを使用します。ランナーや生成済みリポジトリの更新は不要です。</p><p><code>scripts/commands.json</code> にコマンド名、説明、候補に出したいオプションも登録します。利用者は <code>./maw help</code> で一覧を確認でき、次の設定でTab補完を有効にできます。</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#62687b",
		"--shiki-dark": "#818e99"
	})}"># zsh</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">source</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &lt;(</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">./maw</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> completion zsh)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#62687b",
		"--shiki-dark": "#818e99"
	})}"># bash</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">source</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &lt;(</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">./maw</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> completion bash)</span></span></code></pre></div><div class="language-powershell"><button title="Copy Code" class="copy"></button><span class="lang">powershell</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#62687b",
		"--shiki-dark": "#818e99"
	})}"># PowerShell</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">Invoke-Expression</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> (</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">&amp;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> .\\maw completion powershell </span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">|</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> Out-String</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">)</span></span></code></pre></div><h2 id="生成後の手順" tabindex="-1">生成後の手順 <a class="header-anchor" href="#生成後の手順" aria-label="Permalink to “生成後の手順”">​</a></h2><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">cd</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> ../my-addon</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#62687b",
		"--shiki-dark": "#818e99"
	})}"># 本体MOD jar の取り込み（任意 — 本体MODソースが ~/The-four-primitives-and-Weapons にあれば自動）</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">bash</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> scripts/fetch-maw-jar.sh</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#62687b",
		"--shiki-dark": "#818e99"
	})}"># ビルド</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">./gradlew</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> build</span></span></code></pre></div><h2 id="武器を追加する" tabindex="-1">武器を追加する <a class="header-anchor" href="#武器を追加する" aria-label="Permalink to “武器を追加する”">​</a></h2><p>生成したアドオンのディレクトリで次を実行すると、Java登録、モデル、翻訳、武器タイプ、能力値がまとめて追加されます。</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">./maw</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> create-weapon</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --type</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> katana</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --id</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> moon_katana</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --name</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> 月光刀</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --name-en</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &quot;Moon Katana&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --creative-tab</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> minecraft:combat</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --blade-color</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> gray</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --tsuka-color</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> red</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --tsuba-color</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &quot;#708090&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --kasira-color</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> 1a1a1a</span></span></code></pre></div><p>Windows では <code>maw create-weapon ...</code> と入力します。Node.js 18 以上があれば依存関係のインストールは不要です。<code>npm run create-weapon -- ...</code> も引き続き利用できます。</p><p><code>--type</code> は <code>dagger</code>、<code>katana</code>、<code>rapier</code>、<code>tyokuto</code> に対応しています。オプションを省略すると対話形式で入力できます。生成後は案内されたモデルJSONの <code>textures</code> を、自分で配置したPNGへ変更するだけです。</p><p><code>--id</code> または対話入力のアイテムIDに空白が含まれる場合は、自動的に <code>_</code> へ変換されます。半角・全角・連続した空白に対応します（例: <code>moon katana</code> → <code>moon_katana</code>）。</p><p><code>--creative-tab</code> には表示先のクリエイティブタブIDを指定します。既定値は <code>minecraft:combat</code> です。Minecraft名前空間は省略できるため、<code>--creative-tab tools_and_utilities</code> も使用できます。他MODのタブは <code>modid:tab_id</code> の形式で指定します。</p><p>生成アイテムはクリエイティブタブへ色NBT付きで追加されます。<code>/give</code> などでNBTなしのスタックを作った場合も、インベントリへ入ると指定した初期色が補完されます。ゲーム内で染色済みの色は上書きしません。</p><p>代表的なバニラタブ:</p><ul><li><code>minecraft:combat</code></li><li><code>minecraft:tools_and_utilities</code></li><li><code>minecraft:ingredients</code></li><li><code>minecraft:functional_blocks</code></li><li><code>minecraft:building_blocks</code></li></ul><p>全武器で <code>--blade-color</code> による刀身色の指定ができます。刀身テクスチャは通常のironをグレーの基準色として使い、拵えと同様に色名または16進数RGBで着色します。<code>gray</code> は無着色の通常iron（既定値）です。</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">--blade-color</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> gray</span><span style="${ssrRenderStyle({
		"--shiki-light": "#62687b",
		"--shiki-dark": "#818e99"
	})}">       # 通常のiron</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">--blade-color</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> red</span><span style="${ssrRenderStyle({
		"--shiki-light": "#62687b",
		"--shiki-dark": "#818e99"
	})}">        # 色名</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">--blade-color</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &quot;#12ABEF&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#62687b",
		"--shiki-dark": "#818e99"
	})}"> # 16進数RGB</span></span></code></pre></div><p>拵えは本体MODの染色機能を利用するため、色名または16進数RGBで任意の色を指定できます。16進数は <code>#RRGGBB</code>、<code>RRGGBB</code>、<code>0xRRGGBB</code>、短縮形の <code>#RGB</code> に対応しています。<code>#</code> 付きの値はシェルでコメントにならないよう引用符で囲んでください。</p><table tabindex="0"><thead><tr><th>フラグ</th><th>指定例</th><th>既定値</th></tr></thead><tbody><tr><td><code>--tsuka-color</code>（柄）</td><td><code>red</code>, <code>水色</code>, <code>&quot;#12ABEF&quot;</code></td><td><code>black</code></td></tr><tr><td><code>--tsuba-color</code>（鍔）</td><td><code>gold</code>, <code>紫</code>, <code>708090</code></td><td><code>black</code></td></tr><tr><td><code>--kasira-color</code>（頭）</td><td><code>white</code>, <code>茶</code>, <code>0x442211</code></td><td><code>black</code></td></tr></tbody></table><ul><li>ダガー: <code>--grip-color</code>, <code>--tsuba-color</code></li><li>細剣: <code>--grip-color</code>, <code>--guard-color</code>, <code>--pommel-color</code></li><li>直刀: <code>--tsuka-color</code>, <code>--tsuba-color</code>, <code>--kasira-color</code></li></ul><p>英語の基本色名・Minecraft系の色名（<code>dark_blue</code>、<code>light_purple</code> など）に加え、日本語の <code>赤</code>、<code>青</code>、<code>緑</code>、<code>黄</code>、<code>白</code>、<code>黒</code>、<code>灰</code>、<code>紫</code>、<code>桃</code>、<code>橙</code>、<code>水色</code>、<code>茶</code> が使えます。それ以外の色は16進数で指定できます。生成後も、本体MODの通常の染色レシピで拵えを染め直せます。</p><h3 id="鞘への納刀" tabindex="-1">鞘への納刀 <a class="header-anchor" href="#鞘への納刀" aria-label="Permalink to “鞘への納刀”">​</a></h3><p><code>create-weapon</code> で生成した全武器は自動的に対応する鞘へ納刀できます。次の2ファイルも武器と同時に生成されます。</p><ul><li><code>data/&lt;modid&gt;/maw_saya/&lt;item_id&gt;.json</code> — 納刀対象の登録</li><li><code>assets/&lt;modid&gt;/models/custom/saya/&lt;type&gt;/saya_&lt;item_id&gt;.json</code> — 鞘モデル</li></ul><p>既定の鞘モデルはiron用の本体MODモデルを継承します。独自デザインにする場合は、生成された鞘モデルの <code>parent</code> を変更してください。</p><h2 id="例" tabindex="-1">例 <a class="header-anchor" href="#例" aria-label="Permalink to “例”">​</a></h2><p><code>my_cool_addon</code> を <code>~/Documents/github/mods/my-cool-addon</code> に作成:</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">node</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> scripts/create-addon.mjs</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> ~/Documents/github/mods/my-cool-addon</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --yes</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --modid</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> my_cool_addon</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --name</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &quot;My Cool Addon&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> \\</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">  --author</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> atsn-ngs</span></span></code></pre></div><p>省略した項目（<code>--group</code>, <code>--package</code>, <code>--class</code>, <code>--archive</code>）は modId から自動で導出されます。</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("create-addon.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var create_addon_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, create_addon_default as default };
