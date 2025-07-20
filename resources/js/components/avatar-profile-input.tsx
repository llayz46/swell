import { CircleUserRoundIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/use-file-upload';
import { getStorageUrl } from '@/utils/format-storage-url';

export default function AvatarProfileInput({ onFileChange, value }: { onFileChange: (file: File | null) => void, value: string | null }) {
    const [
        { files, isDragging },
        {
            removeFile,
            openFileDialog,
            getInputProps,
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
        },
    ] = useFileUpload({
        accept: "image/*",
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024,
        onFilesChange: (files) => {
            onFileChange(files[0]?.file instanceof File ? files[0].file : null);
        },
    })

    const previewUrl = files[0]?.preview || null

    return (
        <div className="w-fit">
            <div className="relative inline-flex">
                <button
                    type="button"
                    className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-36 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none"
                    onClick={openFileDialog}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-dragging={isDragging || undefined}
                    aria-label={previewUrl ? "Change image" : "Upload image"}
                >
                    {previewUrl || value ? (
                        <img
                            className="size-full object-cover"
                            src={previewUrl ? previewUrl : getStorageUrl(value)}
                            alt={files[0]?.file?.name || "Uploaded image"}
                            width={64}
                            height={64}
                            style={{ objectFit: "cover" }}
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
                        className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
                        aria-label="Remove image"
                    >
                        <XIcon className="size-3.5" />
                    </Button>
                )}
                <input
                    {...getInputProps()}
                    className="sr-only"
                    aria-label="Upload image file"
                    tabIndex={-1}
                />
            </div>
        </div>
    )
}
