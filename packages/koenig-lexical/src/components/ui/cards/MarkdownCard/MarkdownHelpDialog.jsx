import {Modal} from '../../Modal';

export default function MarkdownHelpDialog(props) {
    return (
        <Modal {...props}>
            <div className="p-8">
                <header>
                    <h1>
                        Markdown Help
                    </h1>
                </header>

                <section>
                    <table>
                        <thead>
                            <tr>
                                <th>Markdown</th>
                                <th>Result</th>
                                <th>Shortcut</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>**text**</td>
                                <td><strong>Bold</strong></td>
                                <td>Ctrl/⌘ + B</td>
                            </tr>
                            <tr>
                                <td>*text*</td>
                                <td><em>Emphasize</em></td>
                                <td>Ctrl/⌘ + I</td>
                            </tr>
                            <tr>
                                <td>~~text~~</td>
                                <td>
                                    <del>Strike-through</del>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>[title](http://)</td>
                                <td><a href="#">Link</a></td>
                                <td>Ctrl/⌘ + K</td>
                            </tr>
                            <tr>
                                <td>`code`</td>
                                <td><code>Inline Code</code></td>
                                <td>Ctrl/⌘ + Alt + C</td>
                            </tr>
                            <tr>
                                <td>![alt](http://)</td>
                                <td>Image</td>
                                <td>Ctrl/⌘ + Shift + I</td>
                            </tr>
                            <tr>
                                <td>* item</td>
                                <td>List</td>
                                <td>Ctrl/⌘ + L</td>
                            </tr>
                            <tr>
                                <td>1. item</td>
                                <td>Ordered List</td>
                                <td>Ctrl/⌘ + Alt + L</td>
                            </tr>
                            <tr>
                                <td>> quote</td>
                                <td>Blockquote</td>
                                <td>Ctrl/⌘ + '</td>
                            </tr>
                            <tr>
                                <td>==Highlight==</td>
                                <td>
                                    <mark>Highlight</mark>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td># Heading</td>
                                <td>H1</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>## Heading</td>
                                <td>H2</td>
                                <td>Ctrl/⌘ + H</td>
                            </tr>
                            <tr>
                                <td>### Heading</td>
                                <td>H3</td>
                                <td>Ctrl/⌘ + H (x2)</td>
                            </tr>
                        </tbody>
                    </table>
                    For further Markdown syntax reference: <a
                        href="https://ghost.org/help/using-the-editor/#using-markdown" target="_blank"
                        rel="noopener noreferrer">Markdown Documentation</a>
                </section>
            </div>
        </Modal>
    );
}
