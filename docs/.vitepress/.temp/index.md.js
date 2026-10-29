import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
// docs/index.md
var __pageData = JSON.parse("{\"title\":\"\",\"description\":\"\",\"frontmatter\":{\"layout\":\"home\",\"hero\":{\"name\":\"My Awesome Project\",\"text\":\"A VitePress Site\",\"tagline\":\"My great project tagline\",\"actions\":[{\"theme\":\"brand\",\"text\":\"Markdown Examples\",\"link\":\"/markdown-examples\"},{\"theme\":\"alt\",\"text\":\"API Examples\",\"link\":\"/api-examples\"}]},\"features\":[{\"title\":\"Feature A\",\"details\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit\"},{\"title\":\"Feature B\",\"details\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit\"},{\"title\":\"Feature C\",\"details\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit\"}]},\"headers\":[],\"relativePath\":\"index.md\",\"filePath\":\"index.md\"}");
var _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var docs_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, docs_default as default };
