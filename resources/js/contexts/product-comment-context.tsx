import type { ProductComment } from '@/types';
import { createContext, ReactNode, useContext } from 'react';

interface ProductCommentContextType {
    productId: number;
    comments: ProductComment[];
}

const ProductCommentContext = createContext<ProductCommentContextType | undefined>(undefined);

interface ProductCommentProviderProps {
    productId: number;
    comments: ProductComment[];
    children: ReactNode;
}

export function ProductCommentProvider({ productId, comments, children }: ProductCommentProviderProps) {
    return <ProductCommentContext.Provider value={{ productId, comments }}>{children}</ProductCommentContext.Provider>;
}

export function useProductComment() {
    const context = useContext(ProductCommentContext);

    if (context === undefined) {
        throw new Error("useProductComment doit être utilisé à l'intérieur d'un ProductCommentProvider");
    }

    return context;
}
