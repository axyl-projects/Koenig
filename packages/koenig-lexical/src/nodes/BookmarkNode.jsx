import CardContext from '../context/CardContext';
import KoenigComposerContext from '../context/KoenigComposerContext.jsx';
import React from 'react';
import cleanBasicHtml from '@tryghost/kg-clean-basic-html';
import populateNestedEditor from '../utils/populateNestedEditor';
import {$createLinkNode} from '@lexical/link';
import {$createParagraphNode, $createTextNode, $getNodeByKey, createEditor} from 'lexical';
import {$generateHtmlFromNodes} from '@lexical/html';
import {ActionToolbar} from '../components/ui/ActionToolbar.jsx';
import {BASIC_NODES, KoenigCardWrapper} from '../index.js';
import {BookmarkNode as BaseBookmarkNode, INSERT_BOOKMARK_COMMAND} from '@tryghost/kg-default-nodes';
import {BookmarkCard} from '../components/ui/cards/BookmarkCard';
import {ReactComponent as BookmarkCardIcon} from '../assets/icons/kg-card-type-bookmark.svg';
import {SnippetActionToolbar} from '../components/ui/SnippetActionToolbar.jsx';
import {ToolbarMenu, ToolbarMenuItem} from '../components/ui/ToolbarMenu.jsx';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

// re-export here so we don't need to import from multiple places throughout the app
export {INSERT_BOOKMARK_COMMAND} from '@tryghost/kg-default-nodes';

function BookmarkNodeComponent({author, nodeKey, url, icon, title, description, publisher, thumbnail, captionEditor}) {
    const [editor] = useLexicalComposerContext();

    const {cardConfig} = React.useContext(KoenigComposerContext);
    const {isSelected, isEditing} = React.useContext(CardContext);
    const [urlInputValue, setUrlInputValue] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [urlError, setUrlError] = React.useState(false);
    const [showSnippetToolbar, setShowSnippetToolbar] = React.useState(false);

    const setCaption = (value) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setCaption(value);
        });
    };

    const handleUrlChange = (event) => {
        setUrlInputValue(event.target.value);
    };

    const handleUrlInput = async (event) => {
        fetchMetadata(event.target.value);
    };

    const handleRetry = async () => {
        // TODO: this is causing the card to disappear rather than return to the input field
        //  it almost seems like the card is losing focus and being removed by generic editor behavior..
        setUrlError(false);
    };

    const handlePasteAsLink = () => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            const paragraph = $createParagraphNode()
                .append($createLinkNode(urlInputValue)
                    .append($createTextNode(urlInputValue)));
            node.replace(paragraph);
            paragraph.selectEnd();
        });
    };

    const handleClose = () => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.remove();
        });
    };

    async function fetchMetadata(href) {
        setLoading(true);
        let testData;
        try {
            // set the test data return values in fetchEmbed.js
            testData = await cardConfig.fetchEmbed(href, {type: 'bookmark'});
        } catch (e) {
            setLoading(false);
            setUrlError(true);
            return;
        }
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setUrl(testData.url);
            node.setAuthor(testData.author);
            node.setIcon(testData.icon);
            node.setTitle(testData.title);
            node.setDescription(testData.description);
            node.setPublisher(testData.publisher);
            node.setThumbnail(testData.thumbnail);
        });
        setLoading(false);
    }

    return (
        <>
            <BookmarkCard
                author={author}
                captionEditor={captionEditor}
                description={description}
                handleClose={handleClose}
                handlePasteAsLink={handlePasteAsLink}
                handleRetry={handleRetry}
                handleUrlChange={handleUrlChange}
                handleUrlInput={handleUrlInput}
                icon={icon}
                isLoading={loading}
                isSelected={isSelected}
                publisher={publisher}
                setCaption={setCaption}
                thumbnail={thumbnail}
                title={title}
                url={url}
                urlError={urlError}
                urlInputValue={urlInputValue}
                urlPlaceholder={`Paste URL to add bookmark content...`}
            />
            <ActionToolbar
                data-kg-card-toolbar="bookmark"
                isVisible={showSnippetToolbar}
            >
                <SnippetActionToolbar onClose={() => setShowSnippetToolbar(false)} />
            </ActionToolbar>

            <ActionToolbar
                data-kg-card-toolbar="bookmark"
                isVisible={title && isSelected && !isEditing && !showSnippetToolbar}
            >
                <ToolbarMenu>
                    <ToolbarMenuItem
                        icon="snippet"
                        isActive={false}
                        label="Snippet"
                        onClick={() => setShowSnippetToolbar(true)}
                    />
                </ToolbarMenu>
            </ActionToolbar>
        </>
    );
}

export class BookmarkNode extends BaseBookmarkNode {
    static kgMenu = [{
        label: 'Bookmark',
        desc: 'Embed a link as a visual bookmark',
        Icon: BookmarkCardIcon,
        insertCommand: INSERT_BOOKMARK_COMMAND,
        matches: ['bookmark']
    }];

    getIcon() {
        return BookmarkCardIcon;
    }

    constructor(dataset = {}, key) {
        super(dataset, key);

        // set up and populate nested editors from the serialized HTML
        this.__captionEditor = dataset.captionEditor || createEditor({nodes: BASIC_NODES});
        if (!dataset.captionEditor) {
            populateNestedEditor({editor: this.__captionEditor, initialHtml: dataset.caption});
        }
    }

    createDOM() {
        return document.createElement('div');
    }

    getDataset() {
        const dataset = super.getDataset();

        // client-side only data properties such as nested editors
        const self = this.getLatest();
        dataset.captionEditor = self.__captionEditor;

        return dataset;
    }

    exportJSON() {
        const json = super.exportJSON();

        // convert nested editor instances back into HTML because their content may not
        // be automatically updated when the nested editor changes
        if (this.__captionEditor) {
            this.__captionEditor.getEditorState().read(() => {
                const html = $generateHtmlFromNodes(this.__captionEditor, null);
                const cleanedHtml = cleanBasicHtml(html);
                json.caption = cleanedHtml;
            });
        }

        return json;
    }

    updateDOM() {
        return false;
    }

    decorate() {
        return (
            <KoenigCardWrapper nodeKey={this.getKey()}>
                <BookmarkNodeComponent
                    author={this.__author}
                    captionEditor={this.__captionEditor}
                    description={this.__description}
                    icon={this.__icon}
                    nodeKey={this.getKey()}
                    publisher={this.__publisher}
                    thumbnail={this.__thumbnail}
                    title={this.__title}
                    url={this.__url}
                />
            </KoenigCardWrapper>
        );
    }
}

export const $createBookmarkNode = (dataset) => {
    return new BookmarkNode(dataset);
};

export function $isBookmarkNode(node) {
    return node instanceof BookmarkNode;
}
