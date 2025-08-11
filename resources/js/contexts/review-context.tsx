import type { Review } from '@/types';
import { createContext, ReactNode, useContext } from 'react';

interface ReviewContextType {
    productId: number;
    reviews: Review[];
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

interface ReviewProviderProps {
    productId: number;
    reviews: Review[];
    children: ReactNode;
}

export function ReviewProvider({ productId, reviews, children }: ReviewProviderProps) {
    return <ReviewContext.Provider value={{ productId, reviews }}>{children}</ReviewContext.Provider>;
}

export function useReview() {
    const context = useContext(ReviewContext);

    if (context === undefined) {
        throw new Error("useReview doit être utilisé à l'intérieur d'un ReviewProvider");
    }

    return context;
}
