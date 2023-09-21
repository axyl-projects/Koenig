import KoenigNestedEditor from '../../KoenigNestedEditor';
import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import {$createParagraphNode, $createTextNode, $getRoot} from 'lexical';
import {ButtonGroupSetting, DropdownSetting, SettingsPanel, SliderSetting} from '../SettingsPanel';
import {DateTime} from 'luxon';
import {ReactComponent as GridLayoutIcon} from '../../../assets/icons/kg-layout-grid.svg';
import {ReactComponent as ImgPlaceholderIcon} from '../../../assets/icons/kg-img-placeholder.svg';
import {ReactComponent as ListLayoutIcon} from '../../../assets/icons/kg-layout-list.svg';
import {ReadOnlyOverlay} from '../ReadOnlyOverlay';
import {isEditorEmpty} from '../../../utils/isEditorEmpty';

function PostImage({image, layout, columns, isLoading}) {
    return (
        <div className={clsx(
            'relative flex w-full items-center justify-center bg-grey-200 dark:bg-grey-950',
            isLoading && 'animate-pulse'
        )}>
            <img alt="" className={clsx(
                'w-full object-cover',
                (layout === 'grid' && (columns === 1 || columns === 2)) ? 'aspect-video' : 'aspect-[3/2]',
                (image === null) && 'invisible'
            )} src={image}/>
            <ImgPlaceholderIcon className={clsx(
                'absolute shrink-0 text-grey/80 dark:text-grey/50',
                image && 'hidden',
                layout === 'list' && 'h-9 w-9',
                (layout === 'grid' && columns === 1) && 'h-20 w-20',
                (layout === 'grid' && columns === 2) && 'h-14 w-14',
                (layout === 'grid' && columns === 3) && 'h-12 w-12',
                (layout === 'grid' && columns === 4) && 'h-10 w-10'
            )} />
        </div>
    );
}

function PostTitle({title, layout, columns}) {
    return (
        <div className={clsx(
            'font-bold leading-tight tracking-normal text-black dark:text-grey-100',
            layout === 'list' && 'text-2xl',
            (layout === 'grid' && columns === 1) && 'text-4xl',
            (layout === 'grid' && columns === 2) && 'text-2xl',
            (layout === 'grid' && columns === 3) && 'text-xl',
            (layout === 'grid' && columns === 4) && 'text-[1.7rem]',
        )}>
            {title}
        </div>
    );
}

function PostExcerpt({excerpt, layout, columns}) {
    return (
        <div className={clsx(
            'overflow-y-hidden font-normal leading-snug tracking-[-.01em] text-grey-900 dark:text-grey-600',
            layout === 'list' && 'mt-3 line-clamp-3 max-h-[62px] text-[1.6rem]',
            (layout === 'grid' && columns === 1) && 'mt-4 line-clamp-3 max-h-[75px] text-lg',
            (layout === 'grid' && columns === 2) && 'mt-4 line-clamp-3 max-h-[66px] text-[1.6rem]',
            (layout === 'grid' && columns === 3) && 'mt-3 line-clamp-2 max-h-[42px] text-md',
            (layout === 'grid' && columns === 4) && 'mt-3 line-clamp-2 max-h-[42px] text-md',
        )}>
            {excerpt}
        </div>
    );
}

function PostMeta({publishDate, readTime, layout, columns}) {
    return (
        <div className={clsx(
            'flex font-medium leading-snug text-grey-600 dark:text-grey-400',
            layout === 'list' && 'mt-3 text-[1.3rem]',
            (layout === 'grid' && columns === 1) && 'mt-4 text-sm',
            (layout === 'grid' && columns === 2) && 'mt-4 text-[1.3rem]',
            (layout === 'grid' && columns === 3) && 'mt-3 text-[1.25rem]',
            (layout === 'grid' && columns === 4) && 'mt-3 text-[1.25rem]',
        )}>
            {publishDate ? 
                (<div>{DateTime.fromISO(publishDate).toFormat('d LLL yyyy')}</div>)
                : (<div>{DateTime.now().toFormat('d LLL yyyy')}</div>)}
            {readTime > 0 && <div>&nbsp;&middot; {readTime} min</div>}
        </div>
    );
}

export function CollectionPost({
    post,
    layout,
    columns,
    isPlaceholder,
    options,
    isLoading
}) {
    if (isPlaceholder || isLoading) {
        return (
            <div className={clsx(
                'not-kg-prose relative w-full gap-4 bg-transparent font-sans',
                layout === 'list' && 'grid grid-cols-3',
                layout === 'grid' && 'flex flex-col'
            )}>
                <PostImage columns={columns} image={null} isLoading={isLoading} layout={layout} />
                <div className="col-span-2 flex flex-col items-start justify-start">
                    <div className={clsx(
                        'rounded-full bg-grey-200',
                        layout === 'list' && 'h-5 w-3/4',
                        (layout === 'grid' && columns === 1) && 'mt-3 h-8 w-full',
                        (layout === 'grid' && columns === 2) && 'mt-2 h-5 w-full',
                        (layout === 'grid' && columns === 3) && 'mt-1 h-4 w-full',
                        (layout === 'grid' && columns === 4) && 'h-[1.4rem] w-full',
                        isLoading && 'animate-pulse'
                    )}></div>
                    <div className={clsx(
                        'rounded-full bg-grey-200',
                        layout === 'list' && 'mt-3 h-5 w-1/3',
                        (layout === 'grid' && columns === 1) && 'mt-3 h-8 w-1/2',
                        (layout === 'grid' && columns === 2) && 'mt-3 h-5 w-1/2',
                        (layout === 'grid' && columns === 3) && 'mt-[1rem] h-4 w-1/2',
                        (layout === 'grid' && columns === 4) && 'mt-2 h-[1.4rem] w-1/2',
                        isLoading && 'animate-pulse'
                    )}></div>
                </div>
            </div>
        );
    }
    // may want options later for changing post display (like hiding feature img)
    const {title, feature_image: image, published_at: publishDate, reading_time: readTime, excerpt} = post;

    return (
        <div className={clsx(
            'not-kg-prose relative w-full bg-transparent font-sans',
            layout === 'list' && 'grid grid-cols-3 gap-8',
            layout === 'grid' && 'flex flex-col',
            (layout === 'grid' && columns === 1) && 'gap-5',
            (layout === 'grid' && columns === 2) && 'gap-4',
            (layout === 'grid' && columns === 3) && 'gap-3',
            (layout === 'grid' && columns === 4) && 'gap-3'
        )}>
            {image && <PostImage columns={columns} image={image} isLoading={isLoading} layout={layout} />}
            <div className="col-span-2 flex flex-col items-start justify-start">
                {title && <PostTitle columns={columns} layout={layout} title={title} />}
                {excerpt && <PostExcerpt columns={columns} excerpt={excerpt} layout={layout} />}
                <PostMeta columns={columns} layout={layout} publishDate={publishDate} readTime={readTime} />
            </div>
        </div>
    );
}

export function Collection({
    posts,
    postCount,
    layout,
    columns,
    isLoading
}) {
    function ListPosts() {
        let postList = [];
        for (let i = 0; i < postCount; i++) {
            if (posts && posts[i]) {
                postList.push(<CollectionPost key={posts[i].id} columns={columns} layout={layout} post={posts[i]} />);
            } else {
                postList.push(<CollectionPost key={i} columns={columns} isLoading={isLoading} isPlaceholder={true} layout={layout} />);
            }
        }
        return postList;
    }

    return (
        <>
            {ListPosts()}
        </>
    );
}

export function CollectionCard({
    collection,
    collections,
    columns,
    layout,
    postCount,
    posts,
    handleCollectionChange,
    handleColumnChange,
    handleLayoutChange,
    handlePostCountChange,
    isEditing,
    isLoading,
    headerEditor,
    headerEditorInitialState
}) {
    // collections should be passed in as the editor loads via cardConfig
    const collectionOptions = collections?.filter((item) => {
        // always show default collections
        if (item.slug === 'latest' || item.slug === 'featured') {
            return true;
        }
        return item.posts.length > 0;
    })
        .map((item) => {
            return {
                label: item.title,
                name: item.slug
            };
        });

    const layoutOptions = [
        {
            label: 'List',
            name: 'list',
            Icon: ListLayoutIcon,
            dataTestId: 'collection-layout-list'
        },
        {
            label: 'Grid',
            name: 'grid',
            Icon: GridLayoutIcon,
            dataTestId: 'collection-layout-grid'
        }
    ];

    const onCollectionChange = (value) => {
        checkHeaderDefaults(value);
        handleCollectionChange(value);
    };

    // only update the header if the user hasn't changed anything and is using the default collections & headers
    const checkHeaderDefaults = (value) => {
        if (value !== 'latest' && value !== 'featured') {
            return;
        }
        const header = headerEditor.getEditorState().read(() => ($getRoot().getTextContent())).toLowerCase(); // we use block lettering so we can't differentiate between latest and Latest
        if (value === 'latest' && header === 'featured') {
            headerEditor.update(() => {
                const newHeader = $createParagraphNode().append($createTextNode('Latest'));
                const root = $getRoot();
                root.clear();
                root.append(newHeader);
                root.selectEnd();
            });
        }
        if (value === 'featured' && header === 'latest') {
            headerEditor.update(() => {
                const newHeader = $createParagraphNode().append($createTextNode('Featured'));
                const root = $getRoot();
                root.clear();
                root.append(newHeader);
                root.selectEnd();
            });
        }
    };

    return (
        <>
            {(isEditing || !isEditorEmpty(headerEditor)) && (
                <KoenigNestedEditor
                    autoFocus={true}
                    dataTestId={'collection-header'}
                    hasSettingsPanel={true}
                    initialEditor={headerEditor}
                    initialState={headerEditorInitialState}
                    nodes="minimal"
                    placeholderClassName={'text-md uppercase font-sans leading-normal font-bold tracking-[-.01em] text-black dark:text-grey-50 opacity-40'}
                    placeholderText="Collection title"
                    singleParagraph={true}
                    textClassName={'koenig-lexical-section-title whitespace-normal text-black dark:text-grey-50 opacity-100 pt-2 pb-4'}
                />)
            }
            <div className={clsx(
                'grid w-full',
                layout === 'list' && 'gap-8',
                (layout === 'grid' && columns === 1) && 'grid-cols-1 gap-y-12',
                (layout === 'grid' && columns === 2) && 'grid-cols-2 gap-10',
                (layout === 'grid' && columns === 3) && 'grid-cols-3 gap-8',
                (layout === 'grid' && columns === 4) && 'grid-cols-4 gap-6'
            )}
            data-testid='collection-posts-container'
            >
                <Collection columns={columns} isLoading={isLoading} layout={layout} postCount={postCount} posts={posts} />
            </div>
            {isEditing && (
                <SettingsPanel>
                    <DropdownSetting
                        dataTestId='collections-dropdown'
                        label='Collection'
                        menu={collectionOptions}
                        value={collection}
                        onChange={onCollectionChange}
                    />
                    <ButtonGroupSetting
                        buttons={layoutOptions}
                        dataTestId={'collection-layout'}
                        label="Layout"
                        selectedName={layout}
                        onClick={handleLayoutChange}
                    />
                    <SliderSetting
                        dataTestId={'collection-post-count'}
                        defaultValue={3}
                        description={(!isLoading && postCount > posts.length) && `This collection has ${posts.length} posts, and will continue to fill in as you publish more.`}
                        label="Post Count"
                        max={12}
                        min={1}
                        value={postCount}
                        onChange={handlePostCountChange}
                    />
                    {layout === 'grid' ?
                        <SliderSetting
                            dataTestId={'collection-columns'}
                            defaultValue={3}
                            label="Columns"
                            max={4}
                            min={1}
                            value={columns}
                            onChange={handleColumnChange}
                        />
                        : null
                    }
                </SettingsPanel>
            )}
            {!isEditing && <ReadOnlyOverlay />}
        </>
    );
}

CollectionCard.propTypes = {
    collection: PropTypes.string,
    collections: PropTypes.array,
    columns: PropTypes.number,
    layout: PropTypes.oneOf(['list', 'grid']),
    postCount: PropTypes.number,
    posts: PropTypes.array,
    handleCollectionChange: PropTypes.func,
    handleColumnChange: PropTypes.func,
    handleLayoutChange: PropTypes.func,
    handlePostCountChange: PropTypes.func,
    handleRowChange: PropTypes.func,
    isEditing: PropTypes.bool,
    isLoading: PropTypes.bool,
    headerEditor: PropTypes.object,
    headerEditorInitialState: PropTypes.object
};

Collection.propTypes = {
    posts: PropTypes.array,
    layout: PropTypes.oneOf(['list', 'grid']),
    postCount: PropTypes.number,
    columns: PropTypes.number,
    isLoading: PropTypes.bool
};

CollectionPost.propTypes = {
    post: PropTypes.object,
    layout: PropTypes.oneOf(['list', 'grid']),
    options: PropTypes.object,
    columns: PropTypes.number,
    isPlaceholder: PropTypes.bool,
    isLoading: PropTypes.bool
};

PostImage.propTypes = {
    image: PropTypes.string,
    layout: PropTypes.oneOf(['list', 'grid']),
    columns: PropTypes.number,
    isLoading: PropTypes.bool
};

PostTitle.propTypes = {
    title: PropTypes.string,
    layout: PropTypes.oneOf(['list', 'grid']),
    columns: PropTypes.number
};

PostExcerpt.propTypes = {
    excerpt: PropTypes.string,
    layout: PropTypes.oneOf(['list', 'grid']),
    columns: PropTypes.number
};

PostMeta.propTypes = {
    publishDate: PropTypes.string,
    readTime: PropTypes.number,
    layout: PropTypes.oneOf(['list', 'grid']),
    columns: PropTypes.number
};