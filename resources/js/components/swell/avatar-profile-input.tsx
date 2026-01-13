import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/use-file-upload';
import { CircleUserRoundIcon, XIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface AvatarProfileInputProps {
    name?: string;
    defaultValue?: string | null;
    onFileChange?: (file: File | null) => void;
}

export default function AvatarProfileInput({ name = 'avatar', defaultValue, onFileChange }: AvatarProfileInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [{ files, isDragging }, { removeFile, addFiles, handleDragEnter, handleDragLeave, handleDragOver, handleDrop }] = useFileUpload({
        accept: 'image/*',
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024,
        onFilesChange: (files) => {
            onFileChange?.(files[0]?.file instanceof File ? files[0].file : null);
        },
    });

    const openFileDialog = () => inputRef.current?.click();

    useEffect(() => {
        if (!inputRef.current) return;

        if (files[0]?.file instanceof File) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(files[0].file);
            inputRef.current.files = dataTransfer.files;
        } else {
            inputRef.current.value = '';
        }
    }, [files]);

    const previewUrl = files[0]?.preview || null;

    return (
        <div className="w-fit">
            <div className="relative inline-flex">
                <button
                    type="button"
                    className="relative flex size-36 items-center justify-center overflow-hidden rounded-full border border-dashed border-input transition-colors outline-none hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none data-[dragging=true]:bg-accent/50"
                    onClick={openFileDialog}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-dragging={isDragging || undefined}
                    aria-label={previewUrl ? 'Change image' : 'Upload image'}
                >
                    {previewUrl || defaultValue ? (
                        <img
                            className="size-full object-cover"
                            src={previewUrl ?? defaultValue ?? undefined}
                            alt={files[0]?.file?.name || 'Uploaded image'}
                            width={64}
                            height={64}
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <div aria-hidden="true">
                            <CircleUserRoundIcon className="size-4 opacity-60" />
                        </div>
                    )}
                </button>
                {previewUrl && (
                    <Button
                        type="button"
                        onClick={() => removeFile(files[0]?.id)}
                        size="icon"
                        className="absolute -top-1 -right-1 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
                        aria-label="Remove image"
                    >
                        <XIcon className="size-3.5" />
                    </Button>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    name={name}
                    accept="image/*"
                    onChange={(e) => e.target.files?.length && addFiles(e.target.files)}
                    className="sr-only"
                    aria-label="Upload image file"
                    tabIndex={-1}
                />
            </div>
        </div>
    );
}
