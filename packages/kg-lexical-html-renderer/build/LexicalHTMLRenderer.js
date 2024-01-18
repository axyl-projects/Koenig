"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var headless_1 = require("@lexical/headless");
var list_1 = require("@lexical/list");
var rich_text_1 = require("@lexical/rich-text");
var link_1 = require("@lexical/link");
var convert_to_html_string_1 = require("./convert-to-html-string");
var get_dynamic_data_nodes_1 = require("./get-dynamic-data-nodes");
var LexicalHTMLRenderer = /** @class */ (function () {
    function LexicalHTMLRenderer(_a) {
        var _b = _a === void 0 ? {} : _a, dom = _b.dom, nodes = _b.nodes;
        if (!dom) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            var jsdom = require('jsdom');
            var JSDOM = jsdom.JSDOM;
            this.dom = new JSDOM();
        }
        else {
            this.dom = dom;
        }
        this.nodes = nodes || [];
    }
    LexicalHTMLRenderer.prototype.render = function (lexicalState, userOptions) {
        if (userOptions === void 0) { userOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var defaultOptions, options, DEFAULT_NODES, editor, editorState, dynamicDataNodes, renderData, html;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defaultOptions = {
                            target: 'html',
                            dom: this.dom
                        };
                        options = Object.assign({}, defaultOptions, userOptions);
                        DEFAULT_NODES = __spreadArray([
                            rich_text_1.HeadingNode,
                            list_1.ListNode,
                            list_1.ListItemNode,
                            rich_text_1.QuoteNode,
                            link_1.LinkNode
                        ], this.nodes, true);
                        editor = (0, headless_1.createHeadlessEditor)({
                            nodes: DEFAULT_NODES
                        });
                        editorState = editor.parseEditorState(lexicalState);
                        dynamicDataNodes = (0, get_dynamic_data_nodes_1.default)(editorState);
                        renderData = new Map();
                        return [4 /*yield*/, Promise.all(dynamicDataNodes.map(function (node) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, key, data;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, node.getDynamicData(options)];
                                        case 1:
                                            _a = _b.sent(), key = _a.key, data = _a.data;
                                            renderData.set(key, data);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        options.renderData = renderData;
                        // render nodes
                        editor.setEditorState(editorState);
                        html = '';
                        editor.update(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                html = (0, convert_to_html_string_1.default)(options);
                                return [2 /*return*/];
                            });
                        }); });
                        return [2 /*return*/, html];
                }
            });
        });
    };
    return LexicalHTMLRenderer;
}());
exports.default = LexicalHTMLRenderer;