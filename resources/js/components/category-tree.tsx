import {
    syncDataLoaderFeature,
    expandAllFeature,
    FeatureImplementation,
    selectionFeature
} from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { CheckIcon, FileIcon, FolderIcon, FolderOpenIcon } from 'lucide-react';
import { Tree, TreeItem, TreeItemLabel } from '@/components/tree';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { formatCategoryTree, getParentChainFromTree } from '@/utils/format-category-tree';
import { Label } from '@/components/ui/label';

interface Item {
    name: string;
    children?: string[];
}

const indent = 20;

const doubleClickExpandFeature: FeatureImplementation = {
    itemInstance: {
        getProps: ({ tree, item, prev }) => ({
            ...prev?.(),
            onDoubleClick: () => {
                item.primaryAction()

                if (!item.isFolder()) {
                    return
                }

                if (item.isExpanded()) {
                    item.collapse()
                } else {
                    item.expand()
                }
            },
            onClick: (e: React.MouseEvent) => {
                if (e.shiftKey) {
                    item.selectUpTo(e.ctrlKey || e.metaKey)
                } else if (e.ctrlKey || e.metaKey) {
                    item.toggleSelect()
                } else {
                    tree.setSelectedItems([item.getItemMeta().itemId])
                }

                item.setFocused()
            },
        }),
    },
}

export function CategoryTree({ label, setData, field, initialSelectedItem, onlyChildren }: { label: { htmlFor: string, name: string }, field: string, setData: (parentId: string, id: string) => void, initialSelectedItem?: string, onlyChildren?: boolean }) {
    const { categories } = usePage<SharedData>().props;
    const { items, rootItemId } = formatCategoryTree(categories);

    const tree = useTree<Item>({
        initialState: {
            expandedItems: initialSelectedItem ? getParentChainFromTree(items, initialSelectedItem) ?? [] : [],
            selectedItems: initialSelectedItem ? [initialSelectedItem] : [],
        },
        indent,
        rootItemId: rootItemId,
        getItemName: (item) => item.getItemData().name,
        isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
        dataLoader: {
            getItem: (itemId) => items[itemId],
            getChildren: (itemId) => items[itemId].children ?? [],
        },
        features: [syncDataLoaderFeature, expandAllFeature, doubleClickExpandFeature, selectionFeature],
    });

    return (
        <div className="flex h-full flex-col gap-2 *:first:grow">
            <div className="flex items-center justify-between">
                <Label htmlFor={label.htmlFor}>{label.name}</Label>

                <div className="space-x-2">
                    <button type="button" className="text-xs text-muted-foreground" onClick={() => tree.expandAll()}>Développer</button>
                    <button type="button" className="text-xs text-muted-foreground" onClick={() => tree.collapseAll()}>Réduire</button>
                </div>
            </div>
            <div>
                <Tree
                    className="relative before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
                    indent={indent}
                    tree={tree}
                >
                    {tree.getItems().map((item) => {
                        return (
                            <TreeItem key={item.getId()} item={item}>
                                <TreeItemLabel
                                    className={`relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10 before:bg-background ${item.isSelected() ? 'font-medium text-primary bg-accent/30 rounded' : ''}`}
                                    onClick={() => {
                                        if (onlyChildren) {
                                            if (item.getParent()?.getId() === 'root' && item.getChildren().length > 0) {
                                                return;
                                            }
                                        }

                                        setData(field, item.getId());
                                        item.toggleSelect()
                                    }}
                                >
                                    <span className="flex items-center gap-2">
                                        {item.isFolder() ? (
                                            item.isExpanded() ? (
                                                <FolderOpenIcon className={`pointer-events-none size-4 ${item.isSelected() ? 'text-primary' : 'text-muted-foreground'}`} />
                                            ) : (
                                                <FolderIcon className={`pointer-events-none size-4 ${item.isSelected() ? 'text-primary' : 'text-muted-foreground'}`} />
                                            )
                                        ) : (
                                            <FileIcon className={`pointer-events-none size-4 ${item.isSelected() ? 'text-primary' : 'text-muted-foreground'}`} />
                                        )}
                                        {item.getItemName()}
                                        {item.isSelected() && (
                                            <CheckIcon className="size-4 text-primary" />
                                        )}
                                    </span>
                                </TreeItemLabel>
                            </TreeItem>
                        );
                    })}
                </Tree>
            </div>
        </div>
    );
}
