import { cn } from '@/lib/utils';

type PlaceholderImageProps = {
    className?: string;
    onClick?: () => void;
};

export function PlaceholderImage({ className, onClick }: PlaceholderImageProps) {
    return (
        <div onClick={onClick} className={cn('aspect-square bg-muted text-muted-foreground', className)}>
            <svg viewBox="0 0 1200 1200" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
                <circle cx="600" cy="600" r="136" className="stroke-current opacity-20" strokeWidth="2.5" fill="none" />

                <circle cx="600" cy="600" r="57" className="stroke-current opacity-20" strokeWidth="2.5" fill="none" />

                <g className="fill-current opacity-50">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M616.426 586.58h-31.434v16.176l3.553-3.554.531-.531h9.068l.074-.074 8.463-8.463h2.565l7.18 7.181V586.58Zm-15.715 14.654 3.698 3.699 1.283 1.282-2.565 2.565-1.282-1.283-5.2-5.199h-6.066l-5.514 5.514-.073.073v2.876a2.418 2.418 0 0 0 2.418 2.418h26.598a2.418 2.418 0 0 0 2.418-2.418v-8.317l-8.463-8.463-7.181 7.181-.071.072Zm-19.347 5.442v4.085a6.045 6.045 0 0 0 6.046 6.045h26.598a6.044 6.044 0 0 0 6.045-6.045v-7.108l1.356-1.355-1.282-1.283-.074-.073v-17.989h-38.689v23.43l-.146.146.146.147Z"
                    />
                </g>

                <line x1="600" y1="404" x2="600" y2="796" className="stroke-current opacity-10" strokeWidth="2.5" />
                <line x1="404" y1="600" x2="796" y2="600" className="stroke-current opacity-10" strokeWidth="2.5" />
            </svg>
        </div>
    );
}
