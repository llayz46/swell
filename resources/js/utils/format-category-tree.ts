import { Category } from '@/types';

interface TreeItem {
    name: string
    children: string[]
}

export function formatCategoryTree(categories: Category[]): { items: Record<string, TreeItem>; rootItemId: string } {
    const items: Record<string, TreeItem> = {};

    const processCategory = (category: Category) => {
        const id = String(category.id);
        const children = category.children || [];

        items[id] = {
            name: category.name,
            children: children.map((child) => String(child.id)),
        };

        children.forEach(processCategory);
    };

    // Racine virtuelle
    items['root'] = {
        name: 'Toutes les catégories',
        children: categories.map((cat) => String(cat.id)),
    };

    // Processus récursif
    categories.forEach(processCategory);

    return {
        items,
        rootItemId: 'root',
    };
}

export function getParentChainFromTree(
    items: Record<string, { children?: string[] }>,
    targetId: string,
    currentId = "root",
    path: string[] = []
): string[] | null {
    if (currentId === targetId) return path.filter(id => id !== "root")

    const currentItem = items[currentId]
    if (!currentItem?.children) return null

    for (const childId of currentItem.children) {
        const result = getParentChainFromTree(items, targetId, childId, [...path, currentId])
        if (result) return result
    }

    return null
}
