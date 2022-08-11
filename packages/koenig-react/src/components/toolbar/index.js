import React from 'react';
import MarkupButton from './MarkupButton';
import SectionButton from './SectionButton';

export default function Toolbar({
    editor,
    TOOLBAR_MARGIN = 15,
    TICK_ADJUSTMENT = 8,
    activeMarkupTags,
    activeSectionTags,
    selectedRange
}) {
    const DEFAULTSTYLES = {
        top: 0,
        left: 0,
        right: 0
    };

    const toolbarRef = React.useRef();
    const [showToolbar, setShowToolbar] = React.useState(false);
    const [toolbarPosition, setToolbarPosition] = React.useState(DEFAULTSTYLES);
    const [hasSelectedRange, setHasSelectedRange] = React.useState(false);
    const [onMousemoveHandler, setOnMousemoveHandler] = React.useState(null);
    const [, setIsMouseDown] = React.useState(false);
    const [, setIsMouseUp] = React.useState(false);

    function _toggleVisibility(bool) {
        if (bool) {
            _showToolbar();
        }
        if (!bool) {
            _hideToolbar();
        }
    }

    const _handleMousedown = React.useCallback((event) => {
        if (event.which === 1) {
            setIsMouseDown(true);
            setIsMouseUp(false);
        }
    }, []);

    const _handleMousemove = React.useCallback((event) => {
        if (hasSelectedRange && !showToolbar) {
            setShowToolbar(true);
        }
        _removeMousemoveHandler();
    }, []);

    function _removeMousemoveHandler() {
        window.removeEventListener('mousemove', onMousemoveHandler);
        setOnMousemoveHandler(null);
    }

    const _handleMouseup = React.useCallback((event) => {
        if (event.which === 1) {
            setIsMouseUp(true);
            setIsMouseDown(false);
        }
    }, []);

    function _showToolbar() {
        _positionToolbar();
        setShowToolbar(true);
        if (!showToolbar && onMousemoveHandler) {
            window.addEventListener('mousemove', onMousemoveHandler);
        }
    }

    function _hideToolbar() {
        _removeMousemoveHandler();
        setShowToolbar(false);
    }

    function _positionToolbar() {
        let containerRect = toolbarRef.current.offsetParent.getBoundingClientRect();
        let range = window.getSelection().getRangeAt(0);
        let rangeRect = range.getBoundingClientRect();
        let {width, height} = toolbarRef.current.getBoundingClientRect();
        let newPosition = {};

        // rangeRect is relative to the viewport so we need to subtract the
        // container measurements to get a position relative to the container
        newPosition = {
            top: rangeRect.top - containerRect.top - height - TOOLBAR_MARGIN,
            left: rangeRect.left - containerRect.left + rangeRect.width / 2 - width / 2,
            right: null
        };
        // Prevent left overflow
        if (newPosition.left < 0) {
            newPosition.left = 0;
        }
        setToolbarPosition(newPosition);
    }

    const toolbarPositionStyles = {
        top: `${toolbarPosition.top}px`,
        left: `${toolbarPosition.left}px`,
        zIndex: `${showToolbar ? '999' : '-999'}`,
        pointerEvents: `${showToolbar ? 'auto !important' : 'none !important'}`,
        opacity: `${showToolbar ? '1' : '0'}`
    };

    React.useEffect(() => {
        if (selectedRange?.direction){
            setHasSelectedRange(true);
            _toggleVisibility(true);
        } else {
            setHasSelectedRange(false);
            _toggleVisibility(false);
        }
    }, [selectedRange]);

    React.useEffect(() => {
        window.addEventListener('mousemove', _handleMousemove);
        window.addEventListener('mouseup', _handleMouseup);
        window.addEventListener('mousedown', _handleMousedown);

        return () => {
            window.addEventListener('mousemove', _handleMousemove);
            window.addEventListener('mouseup', _handleMouseup);
            window.addEventListener('mousedown', _handleMousedown);
        };
    }, [_handleMousemove, _handleMousedown, _handleMouseup]);

    return (
        <div ref={toolbarRef}
            className='absolute w-40'
            style={toolbarPositionStyles} >
            <ul className='toolbar-temporary m-0 flex items-center justify-evenly rounded bg-black py-1 px-0 font-sans text-md font-normal text-white' >
                <SectionButton markupTags={activeSectionTags?.isH1} editor={editor} tag={'h1'} />
                <SectionButton markupTags={activeSectionTags?.isH2} editor={editor} tag={'h2'} />
                <MarkupButton markupTags={activeMarkupTags?.isStrong} editor={editor} tag={'strong'}/>
                <MarkupButton markupTags={activeMarkupTags?.isEm} editor={editor} tag={'em'}/>
            </ul>
        </div>
    );
}
