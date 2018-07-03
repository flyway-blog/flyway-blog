var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * scrollIntoViewIfNeeded
 *
 * A Webkit stuff, but it works like a charm!
 */
if (!Element.prototype['scrollIntoViewIfNeeded']) {
    Element.prototype['scrollIntoViewIfNeeded'] = function () {
        var wh = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight, rect = this.getBoundingClientRect();
        if (rect.bottom > wh || rect.top < 0)
            this.scrollIntoView();
    };
}
var MarkdownIME;
(function (MarkdownIME) {
    var Utils;
    (function (Utils) {
        /** dict for text2html(string) */
        var _text2html_dict = {
            '&': '&amp;',
            '  ': '&nbsp;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;'
        };
        /** convert some chars to HTML entities (`&` -> `&amp;`) */
        function text2html(text) {
            return text.replace(/(&|  |"|\<|\>)/g, function (name) { return _text2html_dict[name]; });
        }
        Utils.text2html = text2html;
        /** add slash chars for a RegExp */
        function text2regex(text) {
            return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }
        Utils.text2regex = text2regex;
        /** dict for html_entity_decode(string) */
        var _html_entity_decode_dict = {
            'nbsp': String.fromCharCode(160),
            'amp': '&',
            'quot': '"',
            'lt': '<',
            'gt': '>'
        };
        /** convert HTML entities to chars */
        function html_entity_decode(html) {
            return html.replace(/&(nbsp|amp|quot|lt|gt);/g, function (whole, name) { return _html_entity_decode_dict[name]; });
        }
        Utils.html_entity_decode = html_entity_decode;
        /** remove whitespace in the DOM text. works for textNode. */
        function trim(str) {
            return str.replace(/[\t\r\n ]+/, ' ').trim();
        }
        Utils.trim = trim;
    })(Utils = MarkdownIME.Utils || (MarkdownIME.Utils = {}));
})(MarkdownIME || (MarkdownIME = {}));
var MarkdownIME;
(function (MarkdownIME) {
    var Utils;
    (function (Utils) {
        var Pattern;
        (function (Pattern) {
            var NodeName;
            (function (NodeName) {
                NodeName.list = /^(UL|OL)$/i;
                NodeName.li = /^LI$/i;
                NodeName.cell = /^T[HD]$/i;
                NodeName.line = /^(P|DIV|H\d|T[HD])$/i;
                NodeName.blockquote = /^BLOCKQUOTE$/i;
                NodeName.pre = /^PRE$/i;
                NodeName.hr = /^HR$/i;
                NodeName.autoClose = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
            })(NodeName = Pattern.NodeName || (Pattern.NodeName = {}));
        })(Pattern = Utils.Pattern || (Utils.Pattern = {}));
        /**
         * Check if it's a BR or empty stuff.
         */
        function is_node_empty(node, regardBrAsEmpty) {
            if (regardBrAsEmpty === void 0) { regardBrAsEmpty = true; }
            if (!node)
                return false;
            return (node.nodeType == Node.TEXT_NODE && /^[\s\r\n]*$/.test(node.nodeValue)) ||
                (node.nodeType == Node.COMMENT_NODE) ||
                (regardBrAsEmpty && node.nodeName == "BR");
        }
        Utils.is_node_empty = is_node_empty;
        /**
         * revert is_node_empty()
         */
        function is_node_not_empty(node) {
            return !is_node_empty(node);
        }
        Utils.is_node_not_empty = is_node_not_empty;
        /**
         * Check if one node is a container for text line
         */
        function is_node_block(node) {
            if (!node)
                return false;
            if (node.nodeType != 1)
                return false;
            var re = Pattern.NodeName;
            return (re.line.test(node.nodeName) ||
                re.li.test(node.nodeName) ||
                re.pre.test(node.nodeName));
        }
        Utils.is_node_block = is_node_block;
        /**
         * Check if one line container can be processed.
         */
        function is_line_container_clean(wrapper) {
            var children = get_real_children(wrapper);
            var ci = children.length;
            if (ci == 1 && children[0].nodeType == 1) {
                //cracking nuts like <p><i><b>LEGACY</b></i></p>
                return is_line_container_clean(children[0]);
            }
            while (ci--) {
                var node = children[ci];
                if (node.nodeType == Node.TEXT_NODE)
                    continue; //textNode pass
                return false;
            }
            return true;
        }
        Utils.is_line_container_clean = is_line_container_clean;
        /**
         * Check if one line is empty
         */
        function is_line_empty(line) {
            if (line.textContent.length != 0)
                return false;
            if (line.innerHTML.indexOf('<img ') >= 0)
                return false;
            return true;
        }
        Utils.is_line_empty = is_line_empty;
        /**
         * Get the previousSibling big block wrapper or create one.
         * @note every char in blockTagName shall be upper, like "BLOCKQUOTE"
         */
        function get_or_create_prev_block(node, blockTagName) {
            var rtn = node.previousSibling;
            if (!rtn || rtn.nodeName != blockTagName) {
                rtn = node.ownerDocument.createElement(blockTagName);
                node.parentNode.insertBefore(rtn, node);
            }
            return rtn;
        }
        Utils.get_or_create_prev_block = get_or_create_prev_block;
        /**
         * Find all non-empty children
         */
        function get_real_children(node) {
            return [].filter.call(node.childNodes, is_node_not_empty);
        }
        Utils.get_real_children = get_real_children;
        /**
         * Get all nodes on the same line.
         * This is for lines like <br>...<br>. it is recommended to use TextNode as the anchor.
         * If the anchor is <br>, nodes before it will be in return.
         */
        function get_line_nodes(anchor, wrapper) {
            var rtn = [];
            var tmp;
            tmp = anchor.previousSibling;
            //...
            return rtn;
        }
        Utils.get_line_nodes = get_line_nodes;
        /**
         * Get all parent elements.
         *
         * @returns {Element[]} the parents, exclude `node`, include `end`.
         */
        function build_parent_list(node, end) {
            var rtn = [];
            var iter = node.parentElement;
            while (iter) {
                rtn.push(iter);
                if (iter === end)
                    break;
                iter = iter.parentElement;
            }
            return rtn;
        }
        Utils.build_parent_list = build_parent_list;
        /**
         * help one element wear a wrapper
         */
        function wrap(wrapper, node) {
            node.parentNode.replaceChild(wrapper, node);
            wrapper.appendChild(node);
        }
        Utils.wrap = wrap;
        /**
         * get outerHTML for a new element safely.
         * @see http://www.w3.org/TR/2000/WD-xml-c14n-20000119.html#charescaping
         * @see http://www.w3.org/TR/2011/WD-html-markup-20110113/syntax.html#void-element
         */
        function generateElementHTML(nodeName, props, innerHTML) {
            var rtn = "<" + nodeName;
            if (props) {
                for (var attr in props) {
                    if (!props.hasOwnProperty(attr))
                        continue;
                    var value = "" + props[attr];
                    value = value.replace(/&/g, "&amp;");
                    value = value.replace(/"/g, "&quot;");
                    value = value.replace(/</g, "&lt;");
                    value = value.replace(/\t/g, "&#x9;");
                    value = value.replace(/\r/g, "&#xA;");
                    value = value.replace(/\n/g, "&#xD;");
                    rtn += " " + attr + '="' + value + '"';
                }
            }
            rtn += ">";
            if (innerHTML) {
                rtn += innerHTML + "</" + nodeName + ">";
            }
            else if (!Pattern.NodeName.autoClose.test(nodeName)) {
                rtn += "</" + nodeName + ">";
            }
            return rtn;
        }
        Utils.generateElementHTML = generateElementHTML;
    })(Utils = MarkdownIME.Utils || (MarkdownIME.Utils = {}));
})(MarkdownIME || (MarkdownIME = {}));
/// <reference path="Polyfill.ts" />
/// <reference path="DOM.ts" />
var MarkdownIME;
(function (MarkdownIME) {
    var Utils;
    (function (Utils) {
        /** Move the cursor to the end of one element. */
        function move_cursor_to_end(ele) {
            var document = ele.ownerDocument;
            var selection = document.defaultView.getSelection();
            var range = document.createRange();
            var focusNode = ele;
            while (focusNode.nodeType === Node.ELEMENT_NODE) {
                //find the last non-autoClose child element node, or child text node
                var i = focusNode.childNodes.length;
                while (--i !== -1) {
                    var c = focusNode.childNodes[i];
                    if ((c.nodeType === Node.TEXT_NODE) ||
                        (c.nodeType === Node.ELEMENT_NODE)) {
                        focusNode = c;
                        break;
                    }
                }
                if (i === -1) {
                    break; //not found...
                }
            }
            if (Utils.Pattern.NodeName.autoClose.test(focusNode.nodeName))
                range.selectNode(focusNode);
            else
                range.selectNodeContents(focusNode);
            range.collapse(focusNode.nodeName === "BR");
            selection.removeAllRanges();
            selection.addRange(range);
            focusNode.parentElement && focusNode.parentElement.scrollIntoViewIfNeeded(true);
        }
        Utils.move_cursor_to_end = move_cursor_to_end;
    })(Utils = MarkdownIME.Utils || (MarkdownIME.Utils = {}));
})(MarkdownIME || (MarkdownIME = {}));
/// <reference path="Utils/Polyfill.ts" />
/// <reference path="Utils/String.ts" />
/// <reference path="Utils/Browser.ts" />
/// <reference path="Utils/DOM.ts" />
var MarkdownIME;
(function (MarkdownIME) {
    var Renderer;
    (function (Renderer) {
        var InlineRenderProcess = (function () {
            function InlineRenderProcess(renderer, document, tokens) {
                //iter. the index of current token.
                this.i = 0;
                //the stack that save i
                this.iStack = [];
                this.renderer = renderer;
                this.document = document;
                this.tokens = tokens;
            }
            /** turn tokens into plain string */
            InlineRenderProcess.prototype.toString = function (tokens) {
                var _t = tokens || this.tokens;
                return _t.map(function (t) { return (typeof (t.data) === "string" ? t.data : t.data.textContent); }).join('');
            };
            /** turn tokens into DocumentFragment */
            InlineRenderProcess.prototype.toFragment = function (tokens) {
                var _this = this;
                var _t = tokens || this.tokens;
                var rtn = this.document.createDocumentFragment();
                _t.map(function (t) {
                    var node;
                    if (typeof (t.data) === "string") {
                        node = _this.document.createTextNode(t.data);
                    }
                    else {
                        node = t.data;
                    }
                    rtn.appendChild(node);
                });
                return rtn;
            };
            InlineRenderProcess.prototype.pushi = function () { this.iStack.push(this.i); };
            InlineRenderProcess.prototype.popi = function () { this.i = this.iStack.pop(); };
            InlineRenderProcess.prototype.stacki = function (level) { return this.iStack[this.iStack.length - level]; };
            InlineRenderProcess.prototype.isToken = function (token, tokenChar) { return token && token.isToken && token.data === tokenChar; };
            /** a safe splice for `this.token`; it updates the stack */
            InlineRenderProcess.prototype.splice = function (startIndex, delCount) {
                // console.log(`%cARGUMENT: ${startIndex}, ${delCount}, ${adding.length}`, 'background:#666;color:#FFF')
                // this.debugDump(true);
                var adding = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    adding[_i - 2] = arguments[_i];
                }
                var addCount = adding.length;
                function newValue(i) {
                    //dont know why minus 1 but it works
                    if (i >= startIndex - 1 + delCount)
                        return i - 1 - delCount + addCount;
                    if (i > startIndex - 1)
                        return startIndex - 1; //the deleted stuffs 
                    return i;
                }
                this.i = newValue(this.i);
                this.iStack = this.iStack.map(newValue);
                var rtn = [].splice.apply(this.tokens, arguments);
                // this.debugDump(true);
                return rtn;
            };
            /** Iterate through all tokens, calling corresponding `InlineBracketRuleBase.Proc()` */
            InlineRenderProcess.prototype.execute = function () {
                var _this = this;
                this.i = 0;
                while (this.i < this.tokens.length) {
                    var t = this.tokens[this.i];
                    if (t.isToken) {
                        //call every Rule.Proc() until someone handled the data (returning `true`)
                        var handled = this.renderer.tokenChars[t.data].some(function (rule) { return rule.Proc(_this); });
                    }
                    this.i++;
                }
                this.mergeTextNode();
                this.renderer.rules.forEach(function (rule) {
                    var func = rule && rule['afterProc'];
                    if (typeof func === 'function')
                        func.call(rule, _this);
                });
                this.mergeTextNode();
            };
            /** merge adjacent text nodes into one */
            InlineRenderProcess.prototype.mergeTextNode = function () {
                var tks = this.tokens, i = tks.length;
                while (--i >= 1) {
                    var thisToken = tks[i];
                    var prevToken = tks[i - 1];
                    if (typeof thisToken.data !== 'string' || typeof prevToken.data !== 'string')
                        continue;
                    prevToken.data += thisToken.data;
                    tks.splice(i, 1);
                }
            };
            InlineRenderProcess.prototype.debugDump = function (output) {
                var counter = 0;
                var str = ("I = " + this.i + "\nSTACK = " + this.iStack.join(" -> ") + " \n 0\t ") +
                    JSON.stringify(this.tokens)
                        .slice(1, -1)
                        .replace(/},{/g, function (_) { return ("}\n " + ++counter + "\t {"); });
                if (output) {
                    console.log(str);
                }
                return str;
            };
            return InlineRenderProcess;
        }());
        Renderer.InlineRenderProcess = InlineRenderProcess;
        /**
         * InlineRenderer: Renderer for inline objects
         *
         * Flow:
         *
         * 1. Parse: `Renderer.parse(HTMLElement) => IInlineToken[]`
         * 2. Create a Process: `new InlineRenderProcess(...)`
         * 3. Execute: `InlineRenderProcess.execute()`
         * 4. Update HTMLElement
         *
         * @example
         * ```
         * var renderer = new MarkdownIME.Renderer.InlineRenderer();
         * // Add Markdown rules here...
         * renderer.RenderNode(node); // where node.innerHTML == "Hello **World<img src=...>**"
         * assert(node.innerHTML == "Hello <b>World<img src=...></b>");
         * ```
         */
        var InlineRenderer = (function () {
            function InlineRenderer() {
                this.rules = [];
                /** The chars that could be a token */
                this.tokenChars = {};
            }
            /**
             * do render on a Node
             *
             * @example
             * ```
             * renderer.RenderNode(node); //where node.innerHTML == "Hello **World<img src=...>**"
             * assert(node.innerHTML == "Hello <b>World<img src=...></b>")
             * ```
             */
            InlineRenderer.prototype.RenderNode = function (node) {
                var tokens = this.parse(node);
                var proc = new InlineRenderProcess(this, node.ownerDocument, tokens);
                proc.execute();
                var fragment = proc.toFragment();
                if (node['innerHTML']) {
                    node.innerHTML = "";
                }
                else {
                    while (node.firstChild) {
                        node.removeChild(node.firstChild);
                    }
                }
                node.appendChild(fragment);
            };
            /**
             * Extract tokens.
             *
             * @example
             * ```
             * var tokens = renderer.Parse(node); //where node.innerHTML == "Hello [<img src=...> \\]Welcome](xxx)"
             * tokens[0] == {isToken: false, data: "Hello "}
             * tokens[1] == {isToken: true,  data: "["}
             * tokens[2] == {isToken: false, data: (ElementObject)}
             * tokens[3] == {isToken: false, data: " \\]Welcome"}
             * //...
             * ```
             */
            InlineRenderer.prototype.parse = function (contentContainer) {
                var rtn = [];
                var childNodes = contentContainer.childNodes, childCount = childNodes.length, i = -1;
                var strBuff = "";
                function flushStringBuffer() {
                    strBuff && rtn.push({
                        isToken: false,
                        data: strBuff
                    });
                    strBuff = "";
                }
                while (++i !== childCount) {
                    var node = childNodes[i];
                    if (node.nodeType !== Node.TEXT_NODE) {
                        rtn.push({
                            isToken: false,
                            data: node
                        });
                        continue;
                    }
                    var escaped = false;
                    var str = node.textContent;
                    if (!str.length)
                        continue;
                    for (var j = 0; j !== str.length; j++) {
                        var char = str.charAt(j);
                        if (!escaped && this.tokenChars.hasOwnProperty(char)) {
                            flushStringBuffer();
                            rtn.push({
                                isToken: true,
                                data: char
                            });
                            continue; //skip updating strBuff
                        }
                        else if (escaped)
                            escaped = false;
                        else if (char === "\\")
                            escaped = true;
                        strBuff += char;
                    }
                    flushStringBuffer();
                }
                return rtn;
            };
            /** Add one extra replacing rule */
            InlineRenderer.prototype.addRule = function (rule) {
                this.rules.push(rule);
                if (rule['Proc'] && rule['tokens']) {
                    var mem_1 = this.tokenChars;
                    rule['tokens'].forEach(function (tokenChar) {
                        if (mem_1[tokenChar]) {
                            mem_1[tokenChar].push(rule);
                        }
                        else {
                            mem_1[tokenChar] = [rule];
                        }
                    });
                }
            };
            return InlineRenderer;
        }());
        Renderer.InlineRenderer = InlineRenderer;
    })(Renderer = MarkdownIME.Renderer || (MarkdownIME.Renderer = {}));
})(MarkdownIME || (MarkdownIME = {}));
/// <reference path="../Utils.ts" />
var MarkdownIME;
(function (MarkdownIME) {
    var Renderer;
    (function (Renderer) {
        ;
        var BlockRendererContainer = (function () {
            function BlockRendererContainer() {
                /**
                 * the new nodeName of children. Use `null` to keep original nodeName when elevate a node.
                 * @example "LI" for "ol > li"
                 */
                this.childNodeName = null;
                /**
                 * the new nodeName of parent. Use `null` to prevent creating one.
                 * @example "OL" for "ol > li"
                 */
                this.parentNodeName = null;
                /**
                 * tell if user can type inside. this helps when creating strange things like <hr>
                 */
                this.isTypable = true;
                /**
                 * if is true, the text that matches featureMark will be deleted.
                 */
                this.removeFeatureMark = true;
            }
            /** changing its name, moving it into proper container. return null if failed. */
            BlockRendererContainer.prototype.Elevate = function (node) {
                var feature = this.prepareElevate(node);
                if (!feature)
                    return null;
                var child;
                var parent;
                if (!this.childNodeName) {
                    child = node;
                }
                else {
                    //create a new tag named with childNodeName
                    child = node.ownerDocument.createElement(this.childNodeName);
                    while (node.firstChild) {
                        child.appendChild(node.firstChild);
                    }
                    node.parentNode.insertBefore(child, node);
                    node.parentElement.removeChild(node);
                }
                if (!this.parentNodeName) {
                    //do nothing. need no parent.
                    parent = null;
                }
                else {
                    if (child.previousElementSibling && child.previousElementSibling.nodeName == this.parentNodeName) {
                        //this child is just next to the parent.
                        parent = child.previousElementSibling;
                        parent.appendChild(child);
                    }
                    else {
                        //create parent.
                        parent = child.ownerDocument.createElement(this.parentNodeName);
                        MarkdownIME.Utils.wrap(parent, child);
                    }
                }
                return { child: child, parent: parent, feature: feature };
            };
            /**
             * check if one node is elevatable and remove the feature mark.
             * do NOT use this func outsides Elevate()
             */
            BlockRendererContainer.prototype.prepareElevate = function (node) {
                if (!node)
                    return null;
                var matchResult = this.featureMark.exec(node.textContent);
                if (!matchResult)
                    return null;
                if (this.removeFeatureMark) {
                    var n = node;
                    n.innerHTML = n.innerHTML.replace(/&nbsp;/g, String.fromCharCode(160)).replace(this.featureMark, '');
                }
                return matchResult;
            };
            return BlockRendererContainer;
        }());
        Renderer.BlockRendererContainer = BlockRendererContainer;
        var BlockRendererContainers;
        (function (BlockRendererContainers) {
            var UL = (function (_super) {
                __extends(UL, _super);
                function UL() {
                    _super.call(this);
                    this.name = "unordered list";
                    this.featureMark = /^\s*[\*\+\-]\s+/;
                    this.childNodeName = "LI";
                    this.parentNodeName = "UL";
                }
                return UL;
            }(BlockRendererContainer));
            BlockRendererContainers.UL = UL;
            var OL = (function (_super) {
                __extends(OL, _super);
                function OL() {
                    _super.call(this);
                    this.name = "ordered list";
                    this.featureMark = /^\s*(\d+)\.\s+/;
                    this.childNodeName = "LI";
                    this.parentNodeName = "OL";
                }
                OL.prototype.Elevate = function (node) {
                    var rtn = _super.prototype.Elevate.call(this, node);
                    if (rtn && rtn.parent.childElementCount === 1) {
                        rtn.parent.setAttribute("start", rtn.feature[1]);
                    }
                    return rtn;
                };
                return OL;
            }(BlockRendererContainer));
            BlockRendererContainers.OL = OL;
            var BLOCKQUOTE = (function (_super) {
                __extends(BLOCKQUOTE, _super);
                function BLOCKQUOTE() {
                    _super.call(this);
                    this.name = "blockquote";
                    this.featureMark = /^(\>|&gt;)\s*/;
                    this.parentNodeName = "BLOCKQUOTE";
                }
                return BLOCKQUOTE;
            }(BlockRendererContainer));
            BlockRendererContainers.BLOCKQUOTE = BLOCKQUOTE;
            /** assuming a <hr> is just another block container and things go easier */
            var HR = (function (_super) {
                __extends(HR, _super);
                function HR() {
                    _super.call(this);
                    this.isTypable = false;
                    this.name = "hr";
                    this.featureMark = /^\s{0,2}([\-_\=\*])(\s*\1){2,}$/;
                }
                HR.prototype.Elevate = function (node) {
                    if (!this.prepareElevate(node))
                        return null;
                    var child = node.ownerDocument.createElement("hr");
                    node.parentElement.insertBefore(child, node);
                    node.parentElement.removeChild(node);
                    return { parent: null, child: child };
                };
                return HR;
            }(BlockRendererContainer));
            BlockRendererContainers.HR = HR;
            var CodeBlock = (function (_super) {
                __extends(CodeBlock, _super);
                function CodeBlock() {
                    _super.call(this);
                    this.name = "code block";
                    this.featureMark = /^```(\s*(\w+)\s*)?$/;
                    this.removeFeatureMark = false;
                }
                CodeBlock.prototype.Elevate = function (node) {
                    var match = this.prepareElevate(node);
                    if (!match)
                        return null;
                    //create a new tag named with childNodeName
                    var d = node.ownerDocument;
                    var code = d.createElement("code");
                    var pre = d.createElement("pre");
                    code.innerHTML = '<br data-mdime-bogus="true">';
                    pre.appendChild(code);
                    node.parentNode.insertBefore(pre, node);
                    node.parentElement.removeChild(node);
                    if (match[1]) {
                        pre.setAttribute("lang", match[2]);
                        code.setAttribute("class", match[2]);
                    }
                    return { parent: pre, child: code };
                };
                return CodeBlock;
            }(BlockRendererContainer));
            BlockRendererContainers.CodeBlock = CodeBlock;
            var HeaderText = (function (_super) {
                __extends(HeaderText, _super);
                function HeaderText() {
                    _super.call(this);
                    this.name = "header text";
                    this.featureMark = /^(#+)\s+/;
                }
                HeaderText.prototype.Elevate = function (node) {
                    var match = this.prepareElevate(node);
                    if (!match)
                        return null;
                    //create a new tag named with childNodeName
                    var child = node.ownerDocument.createElement("H" + match[1].length);
                    while (node.firstChild) {
                        child.appendChild(node.firstChild);
                    }
                    node.parentNode.insertBefore(child, node);
                    node.parentElement.removeChild(node);
                    return { parent: null, child: child };
                };
                return HeaderText;
            }(BlockRendererContainer));
            BlockRendererContainers.HeaderText = HeaderText;
            var TableHeader = (function (_super) {
                __extends(TableHeader, _super);
                function TableHeader() {
                    _super.call(this);
                    this.name = "table header";
                    this.featureMark = /^\|(.+)\|$/;
                    this.removeFeatureMark = false;
                }
                TableHeader.prototype.Elevate = function (node) {
                    var match = this.prepareElevate(node);
                    if (!match)
                        return null;
                    //FIXME: styles inside the table header will be discarded!
                    // (in fact, a fancy header is not good :) )
                    //create a new table.
                    var d = node.ownerDocument;
                    var table = d.createElement("table");
                    var tbody = d.createElement("tbody");
                    var tr = d.createElement("tr");
                    var th = match[1].split("|").map(function (text) {
                        var rtn = d.createElement("th");
                        rtn.textContent = text.trim();
                        tr.appendChild(rtn);
                        return rtn;
                    });
                    table.appendChild(tbody);
                    tbody.appendChild(tr);
                    var container = node.parentElement;
                    container.insertBefore(table, node);
                    container.removeChild(node);
                    var extraLine = d.createElement(node.nodeName);
                    extraLine.innerHTML = '<br data-mdime-bogus="true">';
                    container.insertBefore(extraLine, table.nextElementSibling);
                    return { parent: table, child: th[0] };
                };
                return TableHeader;
            }(BlockRendererContainer));
            BlockRendererContainers.TableHeader = TableHeader;
        })(BlockRendererContainers = Renderer.BlockRendererContainers || (Renderer.BlockRendererContainers = {}));
        /**
         * In fact the BlockRenderer is not a renderer; it can elevate / degrade a node, changing its name, moving it from one container to another.
         */
        var BlockRenderer = (function () {
            function BlockRenderer() {
                this.containers = [];
            }
            /** Elevate a node. Make sure the node is a block node. */
            BlockRenderer.prototype.Elevate = function (node) {
                var finalResult = null;
                var elevateOn = node;
                var newestResult;
                while (newestResult = this.ElevateOnce(elevateOn)) {
                    elevateOn = newestResult.child;
                    finalResult = newestResult;
                }
                return finalResult;
            };
            /** Elevate once. Not work with `> ## this situation` */
            BlockRenderer.prototype.ElevateOnce = function (node) {
                for (var i = 0; i < this.containers.length; i++) {
                    var container = this.containers[i];
                    var rtn = container.Elevate(node);
                    if (rtn) {
                        rtn.containerType = container;
                        return rtn;
                    }
                }
                return null;
            };
            /**
             * Get suggested nodeName of a new line inside a container.
             * @return null if no suggestion.
             */
            BlockRenderer.prototype.GetSuggestedNodeName = function (container) {
                for (var i = 0; i < this.containers.length; i++) {
                    var cc = this.containers[i];
                    if (cc.parentNodeName == container.nodeName)
                        return cc.childNodeName;
                }
                return null;
            };
            /**
             * Add Markdown rules into this BlockRenderer
             */
            BlockRenderer.prototype.AddMarkdownRules = function () {
                this.containers = BlockRenderer.markdownContainers.concat(this.containers);
                return this;
            };
            BlockRenderer.markdownContainers = [
                new BlockRendererContainers.CodeBlock(),
                new BlockRendererContainers.TableHeader(),
                new BlockRendererContainers.BLOCKQUOTE(),
                new BlockRendererContainers.HeaderText(),
                new BlockRendererContainers.HR(),
                new BlockRendererContainers.OL(),
                new BlockRendererContainers.UL()
            ];
            return BlockRenderer;
        }());
        Renderer.BlockRenderer = BlockRenderer;
    })(Renderer = MarkdownIME.Renderer || (MarkdownIME.Renderer = {}));
})(MarkdownIME || (MarkdownIME = {}));
/// <reference path="../InlineRenderer.ts" />
var MarkdownIME;
(function (MarkdownIME) {
    var Renderer;
    (function (Renderer) {
        var InlineBracketRuleBase = (function () {
            function InlineBracketRuleBase() {
            }
            InlineBracketRuleBase.prototype.Proc = function (proc) {
                var sti = proc.stacki(1), st = proc.tokens[sti] || { isToken: false, data: "" };
                var tti = proc.i, tt = proc.tokens[tti];
                if (st.isToken && this.isLeftBracket(proc, st, sti) &&
                    tt.isToken && this.isRightBracket(proc, tt, tti)) {
                    var i1 = proc.stacki(1), i2 = proc.i;
                    this.ProcWrappedContent(proc, i1, i2);
                    proc.popi();
                    return true;
                }
                else if (tt.isToken && this.isLeftBracket(proc, tt, tti)) {
                    proc.pushi();
                    return true;
                }
                return false;
            };
            return InlineBracketRuleBase;
        }());
        Renderer.InlineBracketRuleBase = InlineBracketRuleBase;
    })(Renderer = MarkdownIME.Renderer || (MarkdownIME.Renderer = {}));
})(MarkdownIME || (MarkdownIME = {}));
/// <reference path="InlineBracketRuleBase.ts" />
/// <reference path="../InlineRenderer.ts" />
var MarkdownIME;
(function (MarkdownIME) {
    var Renderer;
    (function (Renderer) {
        var Markdown;
        (function (Markdown) {
            /** the name list of built-in Markdown inline rules */
            Markdown.InlineRules = [
                "Emphasis",
                "StrikeThrough",
                "LinkAndImage",
                "LinkAndImageData",
                "InlineCode"
            ];
            /** basic support of **Bold** and **Emphasis** */
            var Emphasis = (function (_super) {
                __extends(Emphasis, _super);
                function Emphasis() {
                    _super.apply(this, arguments);
                    this.name = "Markdown Emphasis";
                    this.tokens = ['*'];
                    this.tagNameEmphasis = "i";
                    this.tagNameStrong = "b";
                }
                Emphasis.prototype.isLeftBracket = function (proc, token, tokenIndex) {
                    return proc.isToken(token, this.tokens[0]);
                };
                Emphasis.prototype.isRightBracket = function (proc, token, tokenIndex) {
                    return proc.isToken(token, this.tokens[0]);
                };
                Emphasis.prototype.ProcWrappedContent = function (proc, i1, i2) {
                    if (i2 === i1 + 1) {
                        //something like `**` of `***this*...`
                        proc.pushi();
                        proc.pushi(); //one more stack push because of the following `proc.popi();`
                        return;
                    }
                    var innerTokens = proc.tokens.slice(i1 + 1, i2);
                    var tagName = this.tagNameEmphasis;
                    var document = proc.document;
                    if (proc.isToken(proc.tokens[i1 - 1], this.tokens[0]) &&
                        proc.isToken(proc.tokens[i2 + 1], this.tokens[0])) {
                        /**
                         * ## This is a `<strong>` tag
                         * ```
                         * The ***Fucking* one**
                         *       >-------<         THIS IS CORRECT
                         *     >>-------------<<   BUT THIS ONE!!
                         * ```
                         */
                        tagName = this.tagNameStrong;
                        i1 -= 1;
                        i2 += 1;
                        proc.popi();
                    }
                    else if (innerTokens.some(function (item) {
                        return !item.isToken && /^(EM|I)$/.test(item.data["nodeName"]);
                    })) {
                        /**
                         * ## Case 1: is a new start
                         * ```
                         * The ***Fucking* Fox *Jumps***
                         *       >-------<         THIS IS CORRECT
                         *      >--------------<   BUT WTF?! NOT A PAIR!
                         * ```
                         */
                        if (innerTokens.length > 1) {
                            proc.pushi();
                            proc.pushi(); //one more stack push because of the following `proc.popi();`
                        }
                        else {
                            proc.splice(i1, i2 - i1 + 1);
                            var src = innerTokens[0].data;
                            var dst = document.createElement(this.tagNameStrong);
                            while (src.firstChild)
                                dst.appendChild(src.firstChild);
                            proc.splice(i1, 0, {
                                isToken: false,
                                data: dst
                            });
                        }
                        return;
                    }
                    proc.splice(i1, i2 - i1 + 1);
                    var fragment = proc.toFragment(innerTokens);
                    var UE = document.createElement(tagName);
                    UE.appendChild(fragment);
                    proc.splice(i1, 0, {
                        isToken: false,
                        data: UE
                    });
                };
                return Emphasis;
            }(Renderer.InlineBracketRuleBase));
            Markdown.Emphasis = Emphasis;
            /** basic support of ~~StrikeThrough~~ */
            var StrikeThrough = (function (_super) {
                __extends(StrikeThrough, _super);
                function StrikeThrough() {
                    _super.apply(this, arguments);
                    this.name = "Markdown StrikeThrough";
                    this.tokens = ['~'];
                    this.tagName = "del";
                }
                StrikeThrough.prototype.isLeftBracket = function (proc, token, tokenIndex) {
                    return proc.isToken(token, this.tokens[0]) &&
                        proc.isToken(proc.tokens[tokenIndex - 1], this.tokens[0]);
                };
                StrikeThrough.prototype.isRightBracket = function (proc, token, tokenIndex) {
                    return proc.isToken(token, this.tokens[0]) &&
                        proc.isToken(proc.tokens[tokenIndex + 1], this.tokens[0]);
                };
                StrikeThrough.prototype.ProcWrappedContent = function (proc, i1, i2) {
                    if (i2 === i1 + 1)
                        return;
                    var document = proc.document;
                    var tokens = proc.splice(i1 - 1, i2 - i1 + 3);
                    tokens = tokens.slice(2, -2);
                    var fragment = proc.toFragment(tokens);
                    var UE = document.createElement(this.tagName);
                    UE.appendChild(fragment);
                    proc.splice(i1 - 1, 0, {
                        isToken: false,
                        data: UE
                    });
                };
                return StrikeThrough;
            }(Renderer.InlineBracketRuleBase));
            Markdown.StrikeThrough = StrikeThrough;
            /** link and image with `[]`
             *
             * Notice: the `src` OR `href` is not implemented here.
             */
            var LinkAndImage = (function (_super) {
                __extends(LinkAndImage, _super);
                function LinkAndImage() {
                    _super.apply(this, arguments);
                    this.name = "Markdown Link and Image";
                    this.tokens = ['[', ']', '!'];
                }
                LinkAndImage.prototype.isLeftBracket = function (proc, token, tokenIndex) {
                    return proc.isToken(token, this.tokens[0]);
                };
                LinkAndImage.prototype.isRightBracket = function (proc, token, tokenIndex) {
                    return proc.isToken(token, this.tokens[1]);
                };
                LinkAndImage.prototype.ProcWrappedContent = function (proc, i1, i2) {
                    var document = proc.document;
                    var UE;
                    var innerTokens = proc.tokens.slice(i1 + 1, i2);
                    if (proc.isToken(proc.tokens[i1 - 1], this.tokens[2])) {
                        UE = document.createElement("img");
                        UE.setAttribute("alt", proc.toString(innerTokens));
                        i1--;
                    }
                    else {
                        if (innerTokens.length === 0)
                            return;
                        var fragment = proc.toFragment(innerTokens);
                        UE = document.createElement("a");
                        UE.setAttribute("href", "");
                        UE.appendChild(fragment);
                    }
                    proc.splice(i1, i2 - i1 + 1, {
                        isToken: false,
                        data: UE
                    });
                };
                return LinkAndImage;
            }(Renderer.InlineBracketRuleBase));
            Markdown.LinkAndImage = LinkAndImage;
            var LinkAndImageData = (function () {
                function LinkAndImageData() {
                    this.name = "Markdown Link and Image Data";
                    this.tokens = ["(", ")"];
                }
                LinkAndImageData.prototype.Proc = function (proc) {
                    var i1 = proc.i, leftToken = proc.tokens[i1];
                    if (!proc.isToken(leftToken, this.tokens[0]))
                        return false;
                    var pt = proc.tokens[i1 - 1];
                    if (!pt || pt.isToken || !pt.data['nodeName'])
                        return false;
                    var ele = pt.data;
                    var attrName;
                    if (ele.tagName === "IMG") {
                        attrName = "src";
                    }
                    else if (ele.tagName === "A") {
                        attrName = "href";
                    }
                    else {
                        return false;
                    }
                    while (++proc.i < proc.tokens.length) {
                        var rightToken = proc.tokens[proc.i];
                        if (proc.isToken(rightToken, this.tokens[1])) {
                            var attrData = proc.toString(proc.tokens.slice(i1 + 1, proc.i)).trim();
                            ele.setAttribute(attrName, attrData);
                            proc.splice(i1, proc.i - i1 + 1);
                            return true;
                        }
                    }
                    return false;
                };
                return LinkAndImageData;
            }());
            Markdown.LinkAndImageData = LinkAndImageData;
            var InlineCode = (function () {
                function InlineCode() {
                    this.name = "Markdown Inline Code";
                    this.tokens = ["`"];
                }
                InlineCode.prototype.Proc = function (proc) {
                    var i1 = proc.i, leftToken = proc.tokens[i1];
                    if (!proc.isToken(leftToken, this.tokens[0]))
                        return false;
                    while (++proc.i < proc.tokens.length) {
                        var rightToken = proc.tokens[proc.i];
                        if (proc.isToken(rightToken, this.tokens[0])) {
                            if (proc.i === i1 + 1) {
                                // something like ``
                                return false;
                            }
                            var code = proc.document.createElement('code');
                            code.textContent = proc.toString(proc.tokens.slice(i1 + 1, proc.i)).trim();
                            proc.splice(i1, proc.i - i1 + 1, {
                                isToken: false,
                                data: code
                            });
                            return true;
                        }
                    }
                    return false;
                };
                return InlineCode;
            }());
            Markdown.InlineCode = InlineCode;
        })(Markdown = Renderer.Markdown || (Renderer.Markdown = {}));
    })(Renderer = MarkdownIME.Renderer || (MarkdownIME.Renderer = {}));
})(MarkdownIME || (MarkdownIME = {}));
/// <reference path="../Renderer/InlineRenderer.ts" />
var MarkdownIME;
(function (MarkdownIME) {
    var Addon;
    (function (Addon) {
        /**
         * EmojiAddon is an add-on for InlineRenderer, translating `8-)` into ![😎](https://twemoji.maxcdn.com/36x36/1f60e.png)
         *
         * Part of the code comes from `markdown-it/markdown-it-emoji`
         *
         * @see https://github.com/markdown-it/markdown-it-emoji/
         */
        var EmojiAddon = (function (_super) {
            __extends(EmojiAddon, _super);
            function EmojiAddon() {
                var _this = this;
                _super.call(this);
                this.name = "Emoji";
                this.tokens = [":"];
                this.use_shortcuts = true;
                /** use twemoji to get `img` tags if possible. if it bothers, disable it. */
                this.use_twemoji = true;
                this.twemoji_config = {};
                /** shortcuts RegExp cache. Order: [shortest, ..., longest] */
                this.shortcuts_cache = [];
                this.chars = {
                    "smile": ["😄", "smiley"],
                    "happy": "😃",
                    "grin": ["😀", "grinning"],
                    "blush": "😊",
                    "wink": "😉",
                    "sad": ["😔", "pensive"],
                    "+1": "👍",
                    "-1": "👎",
                    "heart_eyes": "😍",
                    "kiss": ["😙", "kissing"],
                    "tongue": "😜",
                    "flushed": "😳",
                    "relieved": "😌",
                    "unamused": "😒",
                    "disappointed": "😞",
                    "persevere": "😣",
                    "cry": "😢",
                    "joy": "😂",
                    "sob": "😭",
                    "sleepy": "😪",
                    "cold_sweat": "😰",
                    "sweat": "😓",
                    "weary": "😩",
                    "tired": "😫",
                    "fearful": ["😨", "fear"],
                    "scream": "😱",
                    "angry": "😠",
                    "rage": "😡",
                    "confounded": "😖",
                    "laugh": ["😆", "laughing", "satisfied"],
                    "yum": "😋",
                    "mask": "😷",
                    "sunglasses": ["😎", "cool"],
                    "sleeping": "😴",
                    "dizzy": "😵",
                    "astonished": "😲",
                    "worry": ["😟", "worried"],
                    "frown": ["😦", "frowning"],
                    "anguished": "😧",
                    "imp": "👿",
                    "smiling_imp": "😈",
                    "open_mouth": "😮",
                    "neutral": "😐",
                    "confused": "😕",
                    "hushed": "😯",
                    "no_mouth": "😶",
                    "innocent": ["😇", "angel"],
                    "smirk": "😏",
                    "expressionless": "😑",
                    "joy_cat": "😹",
                    "pouting_cat": "😾",
                    "heart": ["❤️", "love"],
                    "broken_heart": "💔",
                    "two_hearts": "💕",
                    "sparkles": ["✨", "star"],
                    "fist": "✊",
                    "hand": "✋",
                    "raised_hand": "✋",
                    "cat": "🐱",
                    "mouse": "🐭",
                    "cow": "🐮",
                    "monkey": "🐵",
                    "star": "⭐",
                    "zap": "⚡",
                    "umbrella": "☔",
                    "hourglass": "⌛",
                    "watch": "⌚",
                    "black_joker": "🃏",
                    "mahjong": "🀄",
                    "coffee": "☕",
                    "anchor": "⚓",
                    "wheelchair": "♿",
                    "aries": "♈",
                    "taurus": "♉",
                    "gemini": "♊",
                    "cancer": "♋",
                    "leo": "♌",
                    "virgo": "♍",
                    "libra": "♎",
                    "scorpius": "♏",
                    "sagittarius": "♐",
                    "capricorn": "♑",
                    "aquarius": "♒",
                    "pisces": "♓",
                    "loop": "➰"
                };
                /** shortcuts. use RegExp instead of string would be better. */
                this.shortcuts = {
                    angry: ['>:(', '>:-('],
                    blush: [':")', ':-")'],
                    broken_heart: ['</3', '<\\3'],
                    confused: [':/', ':-/', ':\\', ':-\\'],
                    cry: [":'(", ":'-(", ':,(', ':,-('],
                    frowning: [':(', ':-('],
                    heart: ['<3'],
                    two_hearts: [/(<3|❤){2}/g],
                    imp: [']:(', ']:-('],
                    innocent: ['o:)', 'O:)', 'o:-)', 'O:-)', '0:)', '0:-)'],
                    joy: [":')", ":'-)", ':,)', ':,-)', ":'D", ":'-D", ':,D', ':,-D'],
                    kissing: [':*', ':-*'],
                    laughing: ['x-)', 'X-)'],
                    neutral: [':|', ':-|'],
                    open_mouth: [':o', ':-o', ':O', ':-O'],
                    rage: [':@', ':-@'],
                    smile: [':D', ':-D'],
                    smiley: [':)', ':-)'],
                    smiling_imp: [']:)', ']:-)'],
                    sob: [":,'(", ":,'-(", ';(', ';-('],
                    tongue: [':P', ':-P'],
                    sunglasses: ['8-)', 'B-)'],
                    sweat: [',:(', ',:-('],
                    unamused: [':s', ':-S', ':z', ':-Z', ':$', ':-$'],
                    wink: [';)', ';-)']
                };
                for (var key in this.chars) {
                    var ck = this.chars[key];
                    if (ck && ck['length'] && ck['length'] > 1 && ck[1]['length'] > 1) {
                        var ch = ck.shift();
                        ck.push(key);
                        ck.forEach(function (key) { return _this.chars[key] = ch; });
                    }
                }
            }
            EmojiAddon.prototype.isLeftBracket = function (proc, token, tokenIndex) {
                return proc.isToken(token, this.tokens[0]);
            };
            EmojiAddon.prototype.isRightBracket = function (proc, token, tokenIndex) {
                return proc.isToken(token, this.tokens[0]);
            };
            EmojiAddon.prototype.ProcWrappedContent = function (proc, i1, i2) {
                var key = proc.tokens[i1 + 1].data;
                if (i2 !== i1 + 2)
                    return false;
                if (typeof (key) !== 'string')
                    return false;
                var char = this.chars[key];
                if (typeof (char) !== 'string')
                    return false;
                proc.splice(i1, 3, {
                    isToken: false,
                    data: char
                });
                return true;
            };
            EmojiAddon.prototype.afterProc = function (proc) {
                if (!this.shortcuts_cache.length)
                    this.UpdateShortcutCache();
                for (var i = 0; i < proc.tokens.length; i++) {
                    var token = proc.tokens[i];
                    if (typeof token.data !== 'string')
                        continue;
                    var str = token.data;
                    for (var i_1 = this.shortcuts_cache.length - 1; i_1 >= 0; i_1--) {
                        var char = this.chars[this.shortcuts_cache[i_1].targetName];
                        str = str.replace(this.shortcuts_cache[i_1].regexp, char);
                    }
                    token.data = str;
                }
                if (this.use_twemoji && typeof twemoji !== "undefined") {
                    var div = document.createElement('div');
                    for (var i = 0; i < proc.tokens.length; i++) {
                        var token = proc.tokens[i];
                        if (typeof token.data !== 'string')
                            continue;
                        var str = token.data;
                        div.innerHTML = twemoji.parse(str, this.twemoji_config);
                        var args = proc.renderer.parse(div);
                        args = [i, 1].concat(args);
                        [].splice.apply(proc.tokens, args);
                    }
                }
            };
            /** update the shortcuts RegExp cache. Run this after modifing the shortcuts! */
            EmojiAddon.prototype.UpdateShortcutCache = function () {
                this.shortcuts_cache = [];
                for (var name_1 in this.shortcuts) {
                    var shortcut_phrases = this.shortcuts[name_1];
                    for (var s_i = shortcut_phrases.length - 1; s_i >= 0; s_i--) {
                        var regex = shortcut_phrases[s_i];
                        if (!(regex instanceof RegExp)) {
                            regex = new RegExp(MarkdownIME.Utils.text2regex(regex), "g");
                        }
                        this.shortcuts_cache.push({
                            regexp: regex,
                            length: regex.toString().length,
                            targetName: name_1
                        });
                    }
                }
                this.shortcuts_cache.sort(function (a, b) { return (a.length - b.length); });
            };
            return EmojiAddon;
        }(MarkdownIME.Renderer.InlineBracketRuleBase));
        Addon.EmojiAddon = EmojiAddon;
    })(Addon = MarkdownIME.Addon || (MarkdownIME.Addon = {}));
})(MarkdownIME || (MarkdownIME = {}));
/// <reference path="Renderer/InlineRenderer.ts" />
/// <reference path="Renderer/BlockRenderer.ts" />
/// <reference path="Renderer/Inline/MarkdownRules.ts" />
//people <3 emoji
/// <reference path="Addon/EmojiAddon.ts" />
var MarkdownIME;
(function (MarkdownIME) {
    var Renderer;
    (function (Renderer) {
        Renderer.inlineRenderer = new Renderer.InlineRenderer();
        Renderer.blockRenderer = new Renderer.BlockRenderer();
        Renderer.emojiRule = new MarkdownIME.Addon.EmojiAddon();
        Renderer.Markdown.InlineRules.forEach(function (RuleName) {
            var Rule = Renderer.Markdown[RuleName];
            Renderer.inlineRenderer.addRule(new Rule());
        });
        Renderer.inlineRenderer.addRule(Renderer.emojiRule);
        Renderer.blockRenderer.AddMarkdownRules();
        /**
         * Make one Block Node beautiful!
         */
        function Render(node) {
            var elevateResult = Renderer.blockRenderer.Elevate(node);
            if (elevateResult) {
                if (!elevateResult.containerType.isTypable)
                    return elevateResult.child;
                node = elevateResult.child;
            }
            Renderer.inlineRenderer.RenderNode(node);
            return node;
        }
        Renderer.Render = Render;
    })(Renderer = MarkdownIME.Renderer || (MarkdownIME.Renderer = {}));
})(MarkdownIME || (MarkdownIME = {}));
/// <reference path="Utils.ts" />
/// <reference path="Renderer.ts" />
var MarkdownIME;
(function (MarkdownIME) {
    ;
    ;
    var Editor = (function () {
        function Editor(editor, config) {
            this.editor = editor;
            this.document = editor.ownerDocument;
            this.window = editor.ownerDocument.defaultView;
            this.selection = this.window.getSelection();
            this.isTinyMCE = /tinymce/i.test(editor.id);
            this.isIE = /MSIE|Trident\//.test(this.window.navigator.userAgent);
            this.config = config || {};
            for (var key in Editor.defaultConfig) {
                this.config.hasOwnProperty(key) || (this.config[key] = Editor.defaultConfig[key]);
            }
        }
        /**
         * Init MarkdownIME on this editor.
         */
        Editor.prototype.Init = function () {
            //Skip bad items
            if (!this.editor.hasAttribute('contenteditable'))
                return false;
            if (this.editor.hasAttribute('mdime-enhanced'))
                return false;
            this.editor.addEventListener('keydown', this.keydownHandler.bind(this), false);
            this.editor.addEventListener('keyup', this.keyupHandler.bind(this), false);
            this.editor.addEventListener('input', this.inputHandler.bind(this), false);
            this.editor.setAttribute('mdime-enhanced', 'true');
            return true;
        };
        /**
         * get the line element where the cursor is in.
         *
         * @note when half_break is true, other things might not be correct.
         */
        Editor.prototype.GetCurrentLine = function (range) {
            var _dummynode;
            var result = {
                line: null,
                parent_tree: [],
                half_break: false
            };
            // assuming not using tinymce:
            // interesting, the node is always a TextNode.
            // sometimes it became the editor itself / the wrapper, because : 
            // 1. there is no text.
            // 2. not on a text. might be after an image or sth.
            // 3. the cursor was set by some script. (eg. tinymce)
            var node = range.startContainer;
            // proccess tinymce, after this part, the node will be the line element
            if (this.isTinyMCE) {
                /** the block element tinymce created */
                var tinymce_node = node;
                while (!MarkdownIME.Utils.is_node_block(tinymce_node)) {
                    tinymce_node = tinymce_node.parentElement;
                }
                //according to test, node will become <sth><br bogus="true"></sth>
                //if this is half-break, then return
                if (!(node.childNodes.length == 1 && node.firstChild.nodeName == "BR")) {
                    node = tinymce_node;
                    result.half_break = true;
                }
                else 
                //otherwise we get the real and normalized node.
                if (MarkdownIME.Utils.Pattern.NodeName.pre.test(tinymce_node.nodeName)) {
                    //<pre> is special and tinymce handles it well
                    node = tinymce_node;
                }
                else if (MarkdownIME.Utils.Pattern.NodeName.cell.test(tinymce_node.parentElement.nodeName)) {
                    //F**king created two <p> inside a table cell!
                    node = tinymce_node.parentElement; //table cell
                    var oldP = tinymce_node.previousSibling;
                    var oldPChild = void 0;
                    while (oldPChild = oldP.firstChild) {
                        node.insertBefore(oldPChild, oldP);
                    }
                    node.removeChild(oldP);
                    node.removeChild(tinymce_node);
                }
                else {
                    node = tinymce_node.previousSibling;
                    tinymce_node.parentElement.removeChild(tinymce_node);
                    if (MarkdownIME.Utils.Pattern.NodeName.list.test(node.nodeName)) {
                        //tinymce helps us get rid of a list.
                        //but we must get back to it.
                        var tempLi = this.document.createElement('li');
                        node.appendChild(tempLi);
                        node = tempLi;
                    }
                }
            }
            else {
                //judge if is half_break
                if (node.nodeType === Node.TEXT_NODE) {
                    result.half_break = range.startOffset !== node.textContent.length;
                }
            }
            //normalize the node object, if the node is 
            // 1. editor > #text , then create one wrapper and use the wrapper.
            // 2. blockwrapper > [wrapper >] #text , then use the blockwrapper.
            // 3. editor , which means editor is empty. then f**k user.
            //cond 2
            while (!MarkdownIME.Utils.is_node_block(node) && node !== this.editor) {
                node = node.parentNode;
            }
            //cond 3
            if (node === this.editor) {
                node = this.document.createElement(this.config.wrapper);
                var r1 = this.document.createRange();
                r1.selectNodeContents(this.editor);
                r1.surroundContents(node);
            }
            //generate the parent tree to make things easier
            var parent_tree = MarkdownIME.Utils.build_parent_list(node, this.editor);
            console.log(node, parent_tree);
            result.line = node;
            result.parent_tree = parent_tree;
            return result;
        };
        /**
         * Process the line on the cursor.
         * call this from the event handler.
         */
        Editor.prototype.ProcessCurrentLine = function (ev) {
            var range = this.selection.getRangeAt(0);
            if (!range.collapsed)
                return; // avoid processing with strange selection
            var currentLine = this.GetCurrentLine(range);
            var node = currentLine.line;
            var parent_tree = currentLine.parent_tree;
            //finally start processing
            //for <pre> block, special work is needed.
            if (MarkdownIME.Utils.Pattern.NodeName.pre.test(node.nodeName)) {
                var lineBreak = this.document.createElement('br');
                if (!this.isTinyMCE) {
                    //vanilla editor has bug.
                    range.deleteContents();
                    range.insertNode(lineBreak);
                    var ns = lineBreak.nextSibling;
                    if (ns && (ns.nodeType === Node.TEXT_NODE) && (ns.textContent.length === 0)) {
                        lineBreak.parentNode.removeChild(ns);
                    }
                    if (!lineBreak.nextSibling) {
                        lineBreak.parentNode.appendChild(this.document.createElement("br"));
                    }
                    range.selectNodeContents(lineBreak.nextSibling);
                    range.collapse(true);
                    this.selection.removeAllRanges();
                    this.selection.addRange(range);
                    ev.preventDefault();
                }
                var text = node.innerText;
                if (/^\n*(`{2,3})?\n*$/.test(text.substr(text.length - 4))) {
                    var code = node.firstChild;
                    var n = void 0;
                    while (n = code.lastChild,
                        ((n.nodeType === 1 && n.nodeName === "BR") ||
                            (n.nodeType === 3 && /^\n*(```)?\n*$/.test(n.textContent))))
                        code.removeChild(n);
                    this.CreateNewLine(node);
                }
                return;
            }
            else if (MarkdownIME.Utils.is_line_empty(node)) {
                //ouch. it is an empty line.
                console.log("Ouch! empty line.");
                //create one empty line without format.
                var emptyLine = this.GenerateEmptyLine();
                if (MarkdownIME.Utils.Pattern.NodeName.list.test(node.parentNode.nodeName)) {
                    //it's an empty list item
                    //which means it's time to end the list
                    node.parentNode.removeChild(node);
                    // get the list object
                    node = parent_tree.shift();
                    //create empty line
                    if (MarkdownIME.Utils.Pattern.NodeName.list.test(node.parentNode.nodeName)) {
                        //ouch! nested list!
                        emptyLine = this.GenerateEmptyLine("li");
                    }
                }
                else if (MarkdownIME.Utils.Pattern.NodeName.cell.test(node.nodeName)) {
                    //empty table cell
                    var tr = node.parentElement;
                    var table = tr.parentElement.parentElement; // table > tbody > tr
                    if (tr.textContent.trim() === "") {
                        //if the whole row is empty, end the table.
                        tr.parentNode.removeChild(tr);
                        node = table;
                    }
                    else {
                        //otherwise, create a row. 
                        emptyLine = this.CreateNewCell(node);
                        node = null;
                    }
                }
                else if (MarkdownIME.Utils.Pattern.NodeName.blockquote.test(node.parentNode.nodeName)) {
                    //empty line inside a blockquote
                    //end the blockquote
                    node.parentNode.removeChild(node);
                    //get the blockquote object
                    node = parent_tree.shift();
                }
                else {
                }
                node && node.parentNode.insertBefore(emptyLine, node.nextSibling);
                MarkdownIME.Utils.move_cursor_to_end(emptyLine);
                ev.preventDefault();
            }
            else {
                if (currentLine.half_break)
                    return;
                if (node.lastChild.attributes && (node.lastChild.attributes.getNamedItem("data-mdime-bogus") ||
                    node.lastChild.attributes.getNamedItem("data-mce-bogus")))
                    node.removeChild(node.lastChild);
                console.log("Renderer on", node);
                node = MarkdownIME.Renderer.Render(node);
                if (node.parentNode.nodeName === "PRE") {
                    MarkdownIME.Utils.move_cursor_to_end(node);
                    ev.preventDefault();
                }
                else 
                //Create another line after one node and move cursor to it.
                if (this.CreateNewLine(node)) {
                    ev.preventDefault();
                }
                else {
                    //let browser deal with strange things
                    console.error("MarkdownIME Cannot Handle Line Creating");
                    MarkdownIME.Utils.move_cursor_to_end(node);
                }
            }
        };
        /**
         * Create new table row.
         * @argument {Element} refer - current cell
         * @returns  {Element} the corresponding new cell element
         */
        Editor.prototype.CreateNewCell = function (refer) {
            if (!refer || !MarkdownIME.Utils.Pattern.NodeName.cell.test(refer.nodeName))
                return null;
            var rtn;
            var tr = refer.parentNode;
            var table = tr.parentNode.parentNode;
            var newTr = this.document.createElement("tr");
            for (var i = tr.childNodes.length; i--;) {
                if (MarkdownIME.Utils.Pattern.NodeName.cell.test(tr.childNodes[i].nodeName)) {
                    var newTd = newTr.insertCell(0);
                    newTd.innerHTML = this.config.emptyBreak;
                    if (tr.childNodes[i] === refer) {
                        //this new cell is right under the old one
                        rtn = newTd;
                    }
                }
            }
            tr.parentNode.insertBefore(newTr, tr.nextSibling);
            return rtn;
        };
        /**
         * Create new line after one node and move cursor to it.
         *
         * @param   {Element} node - current line element.
         * @returns {Element} new line element or `null`
         */
        Editor.prototype.CreateNewLine = function (node) {
            var newElement;
            var re = MarkdownIME.Utils.Pattern.NodeName;
            //create table row
            if (re.cell.test(node.nodeName)) {
                newElement = this.CreateNewCell(node);
                MarkdownIME.Utils.move_cursor_to_end(newElement);
                return newElement;
            }
            //using browser way to create new line will get dirty format
            //so we create one new line without format.
            var tagName = null;
            if (re.li.test(node.nodeName))
                tagName = "li";
            newElement = this.GenerateEmptyLine(tagName);
            node.parentNode.insertBefore(newElement, node.nextSibling);
            MarkdownIME.Utils.move_cursor_to_end(newElement);
            return newElement;
        };
        /**
         * Handler for keydown
         */
        Editor.prototype.keydownHandler = function (ev) {
            var range = this.selection.getRangeAt(0);
            if (!range.collapsed)
                return; // avoid processing with strange selection
            var keyCode = ev.keyCode || ev.which;
            var noAdditionalKeys = !(ev.shiftKey || ev.ctrlKey || ev.altKey);
            if (noAdditionalKeys && keyCode === 13) {
                this.ProcessCurrentLine(ev);
                return;
            }
            this.keydownHandler_Table(ev);
        };
        /**
         * execute the instant rendering.
         *
         * this will not work inside a `<pre>` element.
         *
         * @param {Range} range where the caret(cursor) is. You can get it from `window.getSelection().getRangeAt(0)`
         * @param {boolean} moveCursor true if you want to move the caret(cursor) after rendering.
         * @return {boolean} successful or not.
         */
        Editor.prototype.instantRender = function (range, moveCursor) {
            var element = range.startContainer.parentNode;
            var blockNode = element;
            while (!MarkdownIME.Utils.is_node_block(blockNode)) {
                blockNode = blockNode.parentNode;
            }
            if (blockNode === this.editor)
                return false;
            if (blockNode.nodeName === "PRE")
                return false;
            if (element.nodeName === "CODE")
                return false;
            if (element === blockNode &&
                range.startContainer.nodeType === Node.TEXT_NODE &&
                range.startContainer === blockNode.firstChild) {
                //execute blockRenderer.Elevate
                var blockRendererResult = MarkdownIME.Renderer.blockRenderer.Elevate(blockNode);
                if (blockRendererResult) {
                    var newBlock = blockRendererResult.child;
                    if (newBlock.textContent.length === 0) {
                        newBlock.innerHTML = this.config.emptyBreak;
                    }
                    moveCursor && MarkdownIME.Utils.move_cursor_to_end(newBlock);
                    return;
                }
            }
            range.setStart(element, 0);
            var fragment = range.extractContents();
            MarkdownIME.Renderer.inlineRenderer.RenderNode(fragment);
            var firstChild = element.firstChild;
            if (firstChild.nodeType === Node.TEXT_NODE && firstChild.textContent === "") {
                element.removeChild(firstChild);
                firstChild = element.firstChild;
            }
            var lastNode = fragment.lastChild;
            element.insertBefore(fragment, firstChild);
            if (moveCursor) {
                if (lastNode.nodeType === Node.TEXT_NODE) {
                    MarkdownIME.Utils.move_cursor_to_end(lastNode);
                }
                else {
                    var range_1 = this.document.createRange();
                    range_1.selectNode(lastNode);
                    range_1.collapse(false);
                    this.selection.removeAllRanges();
                    this.selection.addRange(range_1);
                }
            }
        };
        /**
         * keyupHandler
         *
         * 1. call `instantRender` when space key is released.
         */
        Editor.prototype.keyupHandler = function (ev) {
            var keyCode = ev.keyCode || ev.which;
            var range = this.selection.getRangeAt(0);
            if (this.isIE && keyCode === 32 && range.collapsed && range.startContainer.nodeType === Node.TEXT_NODE) {
                this.instantRender(range, true);
            }
        };
        /**
         * inputHandler
         */
        Editor.prototype.inputHandler = function (ev) {
            var range = this.selection.getRangeAt(0);
            if (range.collapsed && range.startContainer.nodeType === Node.TEXT_NODE && /\s$/.test(range.startContainer.textContent)) {
                this.instantRender(range, true);
            }
        };
        /**
         * Generate Empty Line
         */
        Editor.prototype.GenerateEmptyLine = function (tagName) {
            if (tagName === void 0) { tagName = null; }
            var rtn;
            rtn = this.document.createElement(tagName || this.config.wrapper || "div");
            rtn.innerHTML = this.config.emptyBreak;
            return rtn;
        };
        /**
         * KeyDown Event Handler for Tables
         *
         * Move cursor using TAB, Shift+TAB, UP and DOWN
         *
         * @returns {boolean} handled or not.
         */
        Editor.prototype.keydownHandler_Table = function (ev) {
            var keyCode = ev.keyCode || ev.which;
            var noAdditionalKeys = !(ev.shiftKey || ev.ctrlKey || ev.altKey);
            if ((keyCode !== 8) &&
                (keyCode !== 45) &&
                (keyCode !== 46) &&
                (keyCode !== 9) &&
                (keyCode < 37 || keyCode > 40))
                return false;
            var range = this.selection.getRangeAt(0);
            var parent_tree = MarkdownIME.Utils.build_parent_list(range.startContainer, this.editor);
            parent_tree.unshift(range.startContainer); // for empty cells
            var parent_tree_block = parent_tree.filter(MarkdownIME.Utils.is_node_block);
            var td = parent_tree_block[0];
            var tr = td.parentElement;
            var table = tr.parentElement.parentElement;
            if (!MarkdownIME.Utils.Pattern.NodeName.cell.test(td.nodeName))
                return false;
            var td_index = 0; // the index of current td
            var td_count = tr.childElementCount;
            while (td_index < td_count && tr.children[td_index] !== td)
                td_index++;
            if (td_index >= td_count)
                return false; // not found the cell. awkward but shall not happen
            var focus = null;
            switch (keyCode) {
                case 46: //DELETE
                case 8:
                    if (noAdditionalKeys && td.nodeName === "TH" && !td.textContent.trim()) {
                        focus = (keyCode === 46 && td.nextElementSibling) || td.previousElementSibling;
                        if (!focus) {
                            //the whole table is deleted.
                            focus = table.nextElementSibling || this.CreateNewLine(table);
                            table.parentElement.removeChild(table);
                        }
                        else {
                            for (var i = 0, c = table.childElementCount; i < c; i++) {
                                var tbody = table.children[i];
                                for (var i_2 = 0, c_1 = tbody.childElementCount; i_2 < c_1; i_2++) {
                                    var tr_1 = tbody.children[i_2];
                                    tr_1.removeChild(tr_1.children[td_index]);
                                }
                            }
                        }
                    }
                    else if (noAdditionalKeys && !tr.textContent.trim()) {
                        focus = tr.nextElementSibling || table.nextElementSibling || this.CreateNewLine(table);
                        if (focus.firstElementChild)
                            focus = focus.firstElementChild;
                        tr.parentElement.removeChild(tr);
                    }
                    break;
                case 45:
                    if (!ev.shiftKey)
                        td_index++; //insert column after the current
                    for (var i = 0, c = table.childElementCount; i < c; i++) {
                        var tbody = table.children[i];
                        for (var i_3 = 0, c_2 = tbody.childElementCount; i_3 < c_2; i_3++) {
                            var tr_2 = tbody.children[i_3];
                            var ref = tr_2.children[td_index];
                            var newTd = this.document.createElement(tr_2.children[0].tagName);
                            tr_2.insertBefore(newTd, ref);
                        }
                    }
                    focus = td.parentElement.children[td_index];
                    break;
                case 9:
                    if (noAdditionalKeys)
                        focus = td.nextElementSibling ||
                            (tr.nextElementSibling && tr.nextElementSibling.firstElementChild) ||
                            (this.CreateNewCell(tr.firstElementChild));
                    else if (ev.shiftKey)
                        focus = td.previousElementSibling ||
                            (tr.previousElementSibling && tr.previousElementSibling.lastElementChild) ||
                            table.previousElementSibling;
                    break;
                case 38:
                    if (noAdditionalKeys)
                        focus = (tr.previousElementSibling && tr.previousElementSibling.children[td_index]) ||
                            table.previousElementSibling;
                    break;
                case 40:
                    if (noAdditionalKeys)
                        focus = (tr.nextElementSibling && tr.nextElementSibling.children[td_index]) ||
                            table.nextElementSibling;
                    break;
            }
            if (focus) {
                MarkdownIME.Utils.move_cursor_to_end(focus);
                ev.preventDefault();
                return true;
            }
            return false;
        };
        Editor.defaultConfig = {
            wrapper: 'p',
            emptyBreak: /MSIE (9|10)\./.test(navigator.appVersion) ? '' : '<br data-mdime-bogus="true">'
        };
        return Editor;
    }());
    MarkdownIME.Editor = Editor;
})(MarkdownIME || (MarkdownIME = {}));
var MarkdownIME;
(function (MarkdownIME) {
    var UI;
    (function (UI) {
        (function (ToastStatus) {
            ToastStatus[ToastStatus["Hidden"] = 0] = "Hidden";
            ToastStatus[ToastStatus["Shown"] = 1] = "Shown";
            ToastStatus[ToastStatus["Hiding"] = 2] = "Hiding";
        })(UI.ToastStatus || (UI.ToastStatus = {}));
        var ToastStatus = UI.ToastStatus;
        ;
        /**
         * Tooltip Box, or a Toast on Android.
         *
         * Providing a static method `showToast(text, coveron[, timeout])`, or you can construct one and control its visibility.
         */
        var Toast = (function () {
            function Toast(document, text) {
                this.status = ToastStatus.Hidden;
                this.document = document;
                var ele = document.createElement("div");
                ele.setAttribute("style", Toast.style);
                ele.textContent = text;
                ele.addEventListener('mousedown', this.dismiss.bind(this), false);
                this.element = ele;
            }
            Toast.prototype.setPosition = function (left, topOrBottom, isBottom) {
                var ele = this.element;
                ele.style.left = left + 'px';
                ele.style.top = isBottom && 'initial' || (topOrBottom + 'px');
                ele.style.bottom = isBottom && (topOrBottom + 'px') || 'initial';
            };
            Toast.prototype.show = function (timeout) {
                var _this = this;
                var ele = this.element;
                var dismiss = this.dismiss.bind(this);
                if (!ele.parentElement)
                    this.document.body.appendChild(ele);
                setTimeout(function () {
                    _this.status = ToastStatus.Shown;
                    ele.style.opacity = '1';
                    ele.style.marginTop = '0';
                    if (timeout)
                        setTimeout(dismiss, timeout);
                }, 10);
            };
            Toast.prototype.dismiss = function () {
                var _this = this;
                if (this.status !== ToastStatus.Shown)
                    return;
                this.status = ToastStatus.Hiding;
                var ele = this.element;
                ele.style.opacity = '0';
                ele.style.marginTop = '-10px';
                setTimeout(function () {
                    ele.parentNode.removeChild(ele);
                    _this.status = ToastStatus.Hidden;
                }, 300);
            };
            /**
             * A Quick way to show a temporary Toast over an Element.
             *
             * @param {string} text     message to be shown
             * @param {Element} ref     the location reference
             * @param {number} timeout  time in ms. 0 = do not dismiss.
             * @param {boolean} cover   true = cover on the ref. false = shown on top of the ref.
             */
            Toast.showToast = function (text, ref, timeout, cover) {
                var document = ref.ownerDocument;
                var rect = ref['getBoundingClientRect'] && ref.getBoundingClientRect() || { left: 0, top: 0 };
                var toast = new Toast(document, text);
                rect.left += document.body.scrollLeft;
                rect.top += document.body.scrollTop;
                toast.setPosition(rect.left, rect.top, !cover);
                toast.show(timeout);
                return toast;
            };
            Toast.SHORT = 1500;
            Toast.LONG = 3500;
            Toast.style = "\nposition: absolute;\nfont-family: sans-serif;\npadding: 5px 10px;\nbackground: #e4F68F;\nfont-size: 10pt;\nline-height: 1.4em;\ncolor: #000;\nz-index: 32760;\nmargin-top: -10px;\ntransition: .2s ease;\nopacity: 0;\n";
            return Toast;
        }());
        UI.Toast = Toast;
    })(UI = MarkdownIME.UI || (MarkdownIME.UI = {}));
})(MarkdownIME || (MarkdownIME = {}));
/// <reference path="UI/Toast.ts" />
/*!@preserve
    [MarkdownIME](https://github.com/laobubu/MarkdownIME)
    
    Copyright 2016 laobubu

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
/// <reference path="Utils.ts" />
/// <reference path="Editor.ts" />
/// <reference path="UI.ts" />
var MarkdownIME;
(function (MarkdownIME) {
    /**
     * Fetching contenteditable elements from the window and its iframe.
     */
    function Scan(window) {
        var document = window.document;
        var editors = [].slice.call(document.querySelectorAll('[contenteditable], [designMode]'));
        [].forEach.call(document.querySelectorAll('iframe'), function (i) {
            try {
                var result = Scan(i.contentWindow);
                [].push.apply(editors, result);
            }
            catch (err) {
            }
        });
        return editors;
    }
    MarkdownIME.Scan = Scan;
    /**
     * Enhance one or more editor.
     */
    function Enhance(editor) {
        if (typeof editor['length'] === "number" && editor[0]) {
            return [].map.call(editor, Enhance);
        }
        var rtn;
        rtn = new MarkdownIME.Editor(editor);
        if (rtn.Init())
            return rtn;
        return null;
    }
    MarkdownIME.Enhance = Enhance;
    /**
     * Bookmarklet Entry
     */
    function Bookmarklet(window) {
        Enhance(Scan(window)).forEach(function (editor) {
            if (!editor)
                return;
            MarkdownIME.UI.Toast.showToast("MarkdownIME Activated", editor.editor, MarkdownIME.UI.Toast.SHORT, true);
        });
    }
    MarkdownIME.Bookmarklet = Bookmarklet;
})(MarkdownIME || (MarkdownIME = {}));
/// <reference path="../Renderer/InlineRenderer.ts" />
var MarkdownIME;
(function (MarkdownIME) {
    var Addon;
    (function (Addon) {
        /**
         * MathAddon is an add-on for InlineRenderer, transforms `$y=ax^2+b$` into a formatted html.
         *
         * This addon MUST have a higher priority, than other inline elements like emphasising.
         *
         * To enable, execute this:
         *  `MarkdownIME.Renderer.inlineRenderer.addRule(new MarkdownIME.Addon.MathAddon())`
         *
         * Use CODECOGS API to generate the picture.
         * @see http://latex.codecogs.com/eqneditor/editor.php
         *
         * Originally planned to use http://www.mathjax.org/ , but failed due to its async proccessing.
         */
        var MathAddon = (function () {
            function MathAddon() {
                this.name = "MathFormula";
                //this is the formula image URL prefix.
                this.imgServer = 'http://latex.codecogs.com/gif.latex?';
                this.tokens = ["$"];
            }
            MathAddon.prototype.Proc = function (proc) {
                var i1 = proc.i, leftToken = proc.tokens[i1];
                if (!proc.isToken(leftToken, this.tokens[0]))
                    return false;
                while (++proc.i < proc.tokens.length) {
                    var rightToken = proc.tokens[proc.i];
                    if (proc.isToken(rightToken, this.tokens[0])) {
                        if (proc.i === i1 + 1) {
                            // something like $$ , not valid
                            return false;
                        }
                        var img = proc.document.createElement('img');
                        var formula = proc.toString(proc.tokens.slice(i1 + 1, proc.i)).trim();
                        var imgUrl = this.imgServer + encodeURIComponent(formula);
                        img.setAttribute("src", imgUrl);
                        img.setAttribute("alt", formula);
                        proc.tokens.splice(i1, proc.i - i1 + 1, {
                            isToken: false,
                            data: img
                        });
                        return true;
                    }
                }
                return false;
            };
            return MathAddon;
        }());
        Addon.MathAddon = MathAddon;
    })(Addon = MarkdownIME.Addon || (MarkdownIME.Addon = {}));
})(MarkdownIME || (MarkdownIME = {}));
//# sourceMappingURL=MarkdownIME.js.map