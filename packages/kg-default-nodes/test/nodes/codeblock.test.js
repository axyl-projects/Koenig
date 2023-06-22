const {html} = require('../utils');
const {createHeadlessEditor} = require('@lexical/headless');
const {$generateNodesFromDOM} = require('@lexical/html');
const {JSDOM} = require('jsdom');
const {CodeBlockNode, $createCodeBlockNode, $isCodeBlockNode} = require('../../');
const {$getRoot} = require('lexical');

const editorNodes = [CodeBlockNode];

describe('CodeBlockNode', function () {
    let editor;
    let code;
    let language;
    let caption;
    let exportOptions;

    // NOTE: all tests should use this function, without it you need manual
    // try/catch and done handling to avoid assertion failures not triggering
    // failed tests
    const editorTest = testFn => function (done) {
        editor.update(() => {
            try {
                testFn();
                done();
            } catch (e) {
                done(e);
            }
        });
    };

    beforeEach(function () {
        editor = createHeadlessEditor({nodes: editorNodes});

        code = '<script></script>';
        language = 'javascript';
        caption = 'A code block';

        exportOptions = new Object({
            createDocument: () => {
                return (new JSDOM()).window.document;
            }
        });
    });

    it('matches node with $isCodeBlockNode', editorTest(function () {
        const codeBlockNode = $createCodeBlockNode({language, code, caption});
        $isCodeBlockNode(codeBlockNode).should.be.true;
    }));

    describe('importJSON', function () {
        it('imports all properties', function (done) {
            const serialized = `
                {
                    "root": {
                        "children": [
                            {
                                "type": "codeblock",
                                "code": "<?php echo 'Hello World'; ?>",
                                "language": "php",
                                "caption": "Your first PHP enabled page"
                            }
                        ],
                        "direction": null,
                        "format": "",
                        "indent": 0,
                        "type": "root",
                        "version": 1
                    }
                }
            `;

            const editorState = editor.parseEditorState(serialized);

            editorState.read(() => {
                try {
                    const codeBlockNode = $getRoot().getChildren()[0];
                    should(codeBlockNode.code).equal(`<?php echo 'Hello World'; ?>`);
                    should(codeBlockNode.language).equal('php');
                    should(codeBlockNode.caption).equal('Your first PHP enabled page');
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
    });

    describe('exportJSON', function () {
        it('exports all properties', function (done) {
            editor.update(() => {
                try {
                    const codeBlockNode = $createCodeBlockNode({code, language, caption});
                    $getRoot().append(codeBlockNode);
                } catch (e) {
                    done(e);
                }
            }, {discrete: true});

            const parsedExport = JSON.parse(JSON.stringify(editor.getEditorState()));

            parsedExport.root.children.should.deepEqual([
                {
                    type: 'codeblock',
                    version: 1,
                    code: '<script></script>',
                    language: 'javascript',
                    caption: 'A code block'
                }
            ]);
            done();
        });
    });

    describe('data access', function () {
        it('has getters for all properties', editorTest(function () {
            const codeBlockNode = $createCodeBlockNode({language, code, caption});

            codeBlockNode.code.should.equal('<script></script>');
            codeBlockNode.language.should.equal('javascript');
            codeBlockNode.caption.should.equal('A code block');
        }));

        it('has setters for all properties', editorTest(function () {
            const codeBlockNode = $createCodeBlockNode({language: '', code: '', caption: ''});

            codeBlockNode.language.should.equal('');
            codeBlockNode.language = 'javascript';
            codeBlockNode.language.should.equal('javascript');

            codeBlockNode.code.should.equal('');
            codeBlockNode.code = '<script></script>';
            codeBlockNode.code.should.equal('<script></script>');

            codeBlockNode.caption.should.equal('');
            codeBlockNode.caption = 'A code block';
            codeBlockNode.caption.should.equal('A code block');
        }));

        it('has getDataset() convenience method', editorTest(function () {
            const codeBlockNode = $createCodeBlockNode({language, code, caption});
            const codeBlockNodeDataset = codeBlockNode.getDataset();

            codeBlockNodeDataset.should.deepEqual({
                code: '<script></script>',
                language: 'javascript',
                caption: 'A code block'
            });
        }));

        it('has isEmpty() convenience method', editorTest(function () {
            const codeBlockNode = $createCodeBlockNode({language, code, caption});

            codeBlockNode.isEmpty().should.be.false;
            codeBlockNode.code = '';
            codeBlockNode.isEmpty().should.be.true;
        }));
    });

    describe('exportDOM', function () {
        it('renders and escapes', editorTest(function () {
            const codeBlockNode = $createCodeBlockNode({code});
            const {element} = codeBlockNode.exportDOM(exportOptions);

            element.outerHTML.should.prettifyTo(html`
                <pre><code>&lt;script&gt;&lt;/script&gt;</code></pre>
            `);
        }));

        it('renders language class if provided', editorTest(function () {
            const codeBlockNode = $createCodeBlockNode({language, code});
            const {element} = codeBlockNode.exportDOM(exportOptions);

            element.outerHTML.should.prettifyTo(html`
                <pre><code class="language-javascript">&lt;script&gt;&lt;/script&gt;</code></pre>
            `);
        }));

        it('renders empty span when code is undefined or empty', editorTest(function () {
            const codeBlockNode = $createCodeBlockNode({code: ''});
            const {element} = codeBlockNode.exportDOM(exportOptions);

            element.outerHTML.should.equal('<span></span>');
        }));

        it('renders a figure if a caption is provided', editorTest(function () {
            const codeBlockNode = $createCodeBlockNode({language, code, caption});
            const {element} = codeBlockNode.exportDOM(exportOptions);

            element.outerHTML.should.prettifyTo(html`
                <figure class="kg-card kg-code-card">
                    <pre><code class="language-javascript">&lt;script&gt;&lt;/script&gt;</code></pre>
                    <figcaption>A code block</figcaption>
                </figure>
            `);
        }));
    });

    describe('importDOM', function () {
        it('parses PRE>CODE inside FIGURE into code card', editorTest(function () {
            const dom = (new JSDOM(html`
                <figure><pre><code>Test code</code></pre></figure>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);

            nodes.length.should.equal(1);
            nodes[0].code.should.equal('Test code');
            nodes[0].language.should.equal('');
            nodes[0].caption.should.equal('');
        }));

        it('parses PRE>CODE inside FIGURE with FIGCAPTION into code card', editorTest(function () {
            const dom = (new JSDOM(html`
                <figure><pre><code>Test code</code></pre><figcaption>Test caption</figcaption></figure>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);

            nodes.length.should.equal(1);
            nodes[0].code.should.equal('Test code');
            nodes[0].caption.should.equal('Test caption');
            nodes[0].language.should.equal('');
        }));

        it('extracts language from pre class name for FIGURE>PRE>CODE', editorTest(function () {
            const dom = (new JSDOM(html`
                <figure><pre class="language-js"><code>Test code</code></pre><figcaption>Test caption</figcaption></figure>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);

            nodes.length.should.equal(1);
            nodes[0].code.should.equal('Test code');
            nodes[0].caption.should.equal('Test caption');
            nodes[0].language.should.equal('js');
        }));

        it('extracts language from code class name for FIGURE>PRE>CODE', editorTest(function () {
            const dom = (new JSDOM(html`
                <figure><pre><code class="language-js">Test code</code></pre><figcaption>Test caption</figcaption></figure>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);

            nodes.length.should.equal(1);
            nodes[0].code.should.equal('Test code');
            nodes[0].caption.should.equal('Test caption');
            nodes[0].language.should.equal('js');
        }));

        it('correctly skips if there is no pre tag', editorTest(function () {
            const dom = (new JSDOM(html`
                <figure><div><span class="nothing-to-see-here"></span></div></figure>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);

            nodes.length.should.equal(0);
        }));

        it('parses PRE>CODE into code card', editorTest(function () {
            const dom = (new JSDOM(html`
                <figure><pre><code>Test code</code></pre></figure>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);

            nodes.length.should.equal(1);
            nodes[0].code.should.equal('Test code');
            nodes[0].language.should.equal('');
            nodes[0].caption.should.equal('');
        }));

        it('extracts language from pre class name for PRE>CODE', editorTest(function () {
            const dom = (new JSDOM(html`
                <figure><pre class="language-javascript"><code>Test code</code></pre></figure>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);

            nodes.length.should.equal(1);
            nodes[0].code.should.equal('Test code');
            nodes[0].language.should.equal('javascript');
            nodes[0].caption.should.equal('');
        }));

        it('extracts language from code class name for PRE>CODE', editorTest(function () {
            const dom = (new JSDOM(html`
                <figure><pre><code class="language-ruby">Test code</code></pre></figure>
            `)).window.document;
            const nodes = $generateNodesFromDOM(editor, dom);

            nodes.length.should.equal(1);
            nodes[0].code.should.equal('Test code');
            nodes[0].language.should.equal('ruby');
            nodes[0].caption.should.equal('');
        }));
    });

    describe('getTextContent', function () {
        it('returns contents', editorTest(function () {
            const node = $createCodeBlockNode();
            node.getTextContent().should.equal('');

            node.code = '<script>const test = true;</script>';
            node.caption = 'Test caption';

            node.getTextContent().should.equal('<script>const test = true;</script>\nTest caption\n\n');
        }));
    });
});
