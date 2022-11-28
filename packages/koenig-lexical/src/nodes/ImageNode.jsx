import React from 'react';
import {ImageNode as BaseImageNode, INSERT_IMAGE_COMMAND} from '@tryghost/kg-default-nodes';
import KoenigCardWrapper from '../components/KoenigCardWrapper';
import {ReactComponent as ImageCardIcon} from '../assets/icons/kg-card-type-image.svg';
import {ImageNodeComponent} from './ImageNodeComponent';

// re-export here so we don't need to import from multiple places throughout the app
export {INSERT_IMAGE_COMMAND} from '@tryghost/kg-default-nodes';

export class ImageNode extends BaseImageNode {
    // transient properties used to control node behaviour
    __triggerFileDialog = false;
    __previewSrc = null;

    static kgMenu = {
        label: 'Image',
        desc: 'Upload, or embed with /image [url]',
        Icon: ImageCardIcon,
        insertCommand: INSERT_IMAGE_COMMAND,
        insertParams: {
            triggerFileDialog: true
        },
        matches: ['image', 'img'],
        queryParams: ['src']
    };

    constructor(dataset = {}, key) {
        super(dataset, key);

        const {previewSrc, triggerFileDialog} = dataset;

        this.__previewSrc = previewSrc || '';
        this.__triggerFileDialog = triggerFileDialog || false;
    }

    static clone(node) {
        return new ImageNode(
            {
                src: node.__src,
                caption: node.__caption,
                altText: node.__altText,
                cardWidth: node.__cardWidth,
                width: node.__width,
                height: node.__height
            },
            node.__key
        );
    }

    getPreviewSrc() {
        return this.__previewSrc;
    }

    setPreviewSrc(previewSrc) {
        const writable = this.getWritable();
        return writable.__previewSrc = previewSrc;
    }

    setTriggerFileDialog(shouldTrigger) {
        const writable = this.getWritable();
        return writable.__triggerFileDialog = shouldTrigger;
    }

    createDOM() {
        return document.createElement('div');
    }

    decorate() {
        return (
            <KoenigCardWrapper nodeKey={this.getKey()} width={this.__cardWidth}>
                <ImageNodeComponent
                    nodeKey={this.getKey()}
                    src={this.__src}
                    altText={this.__altText}
                    caption={this.__caption}
                    triggerFileDialog={this.__triggerFileDialog}
                    previewSrc={this.getPreviewSrc()}
                />
            </KoenigCardWrapper>
        );
    }
}

export const $createImageNode = (dataset) => {
    // don't trigger the file dialog when rendering if we've already been given a url
    if (dataset.src) {
        delete dataset.triggerFileDialog;
    }

    return new ImageNode(dataset);
};

export function $isImageNode(node) {
    return node instanceof ImageNode;
}
