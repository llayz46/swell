import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import { useFileUpload } from '@/hooks/use-file-upload';
import { FormTabContentProps, ProductForm } from '@/types';
import { getStorageUrl } from '@/utils/format-storage-url';
import {
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    closestCenter
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    arrayMove
} from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { AlertCircleIcon, GripVertical, ImageIcon, Star, Trash2, Upload, UploadIcon } from 'lucide-react';

export function ImagesTabContent({ data, setData, processing }: FormTabContentProps<ProductForm>) {
    const maxSizeMB = 2;
    const maxSize = maxSizeMB * 1024 * 1024;
    const maxFiles = 6;

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    const [
        { files, isDragging, errors },
        { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps, removeFile },
    ] = useFileUpload({
        accept: 'image/svg+xml,image/png,image/jpeg,image/jpg,image/webp,image/gif',
        maxSize,
        multiple: true,
        maxFiles,
        initialFiles: data.images.map((img) => ({
            id: String(img.id),
            name: img.alt_text || `image-${img.id}`,
            size: 0,
            type: '',
            url: img.image_url || '',
        })),
        onFilesAdded: (addedFiles) => {
            const baseOrder = data.images.length;

            const newImages = addedFiles.map((fileWithPreview, index) => {
                const imageUrl = fileWithPreview.preview || '';

                return {
                    id: null,
                    image_url: imageUrl,
                    image_file: fileWithPreview.file instanceof File ? fileWithPreview.file : null,
                    alt_text: fileWithPreview.file instanceof File ? fileWithPreview.file.name : '',
                    is_featured: false,
                    order: baseOrder + index + 1
                };
            });

            setData('images', [...data.images, ...newImages]);
        },
    });

    const handleImageAltChange = (imageIndex: number, altTextValue: string) => {
        const newImages = [...data.images];
        newImages[imageIndex] = { ...newImages[imageIndex], alt_text: altTextValue };
        setData('images', newImages);
    };

    const setFeaturedImage = (imageIndex: number) => {
        const newImages = data.images.map((img, index) => ({
            ...img,
            is_featured: index === imageIndex,
        }));
        setData('images', newImages);
    };

    const removeImage = (imageIndex: number) => {
        const imageToRemove = data.images[imageIndex];
        const newImages = data.images.filter((_, index) => index !== imageIndex);

        if (imageToRemove && String(imageToRemove.id)) {
            removeFile(String(imageToRemove.id));
        }

        setData('images', newImages);
    };

    return (
        <TabsContent value="images" className="space-y-4">
            <Card className="max-sm:py-4 border-border bg-card">
                <CardHeader className="max-sm:px-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground">Images du produit</CardTitle>
                        <Button variant="outline" onClick={openFileDialog} type="button" tabIndex={1} disabled={processing}>
                            <Upload />
                            Ajouter des images
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 max-sm:px-4">
                    <div className="flex flex-col gap-2">
                        <div
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            data-dragging={isDragging || undefined}
                            data-files={files.length > 0 || undefined}
                            className="relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
                        >
                            <input {...getInputProps()} className="sr-only" aria-label="Upload image file" />
                            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                                <div
                                    className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
                                    aria-hidden="true"
                                >
                                    <ImageIcon className="size-4 opacity-60" />
                                </div>
                                <p className="mb-1.5 text-sm font-medium">Glissez-déposez vos images ici ou cliquez pour sélectionner</p>
                                <p className="text-xs text-muted-foreground">SVG, PNG, JPG, WEBP ou GIF (max. {maxSizeMB}MB)</p>
                                <Button variant="outline" className="mt-4" onClick={openFileDialog} type="button" tabIndex={2} disabled={processing}>
                                    <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
                                    Sélectionner des images
                                </Button>
                            </div>
                        </div>

                        {errors.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-destructive" role="alert">
                                <AlertCircleIcon className="size-3 shrink-0" />
                                <span>{errors[0]}</span>
                            </div>
                        )}
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        modifiers={[restrictToWindowEdges]}
                        onDragEnd={(event: DragEndEvent) => {
                            const { active, over } = event;

                            if (over && active.id !== over.id) {
                                const oldIndex = data.images.findIndex((img) => String(img.alt_text) === String(active.id));
                                const newIndex = data.images.findIndex((img) => String(img.alt_text) === String(over.id));

                                const newImages = arrayMove(data.images, oldIndex, newIndex).map((img, idx) => ({
                                    ...img,
                                    order: idx + 1
                                }));

                                setData('images', newImages);
                            }
                        }}
                    >
                        <SortableContext items={data.images.map(img => img.alt_text)}>
                            <div className="grid gap-4 md:grid-cols-2 w-full">
                                {data.images.map((image, index) => (
                                    <ImageSortableItem
                                        key={index}
                                        image={image}
                                        index={index}
                                        setFeaturedImage={() => setFeaturedImage(index)}
                                        removeImage={() => removeImage(index)}
                                        handleImageAltChange={handleImageAltChange}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {data.images.length === 0 && (
                        <div className="py-8 text-center text-muted-foreground">
                            <Upload className="mx-auto mb-4 size-12 opacity-50" />
                            <p>Aucune image ajoutée</p>
                            <p className="text-sm">Cliquez sur "Ajouter des images" pour commencer</p>
                        </div>
                    )}

                    {data.images.length > 0 && (
                        <div className="rounded-lg bg-muted/50 p-4">
                            <h4 className="mb-2 font-medium text-foreground">💡 Conseils pour vos images</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• Utilisez des images de haute qualité (minimum 800x800px)</li>
                                <li>• Ajoutez des descriptions alternatives pour le SEO</li>
                                <li>• Montrez le produit sous différents angles</li>
                                <li>• Évitez les images floues ou mal éclairées</li>
                                <li>• Glissez-déposez pour réorganiser facilement les images</li>
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
    );
}

function ImageSortableItem({
    image,
    index,
    setFeaturedImage,
    removeImage,
    handleImageAltChange,
}: {
    image: ProductForm['images'][number];
    index: number;
    setFeaturedImage: (id: number | string) => void;
    removeImage: (id: number) => void;
    handleImageAltChange: (id: number, altText: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: image.alt_text,
        transition: {
            duration: 150,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
        },
        animateLayoutChanges: () => false,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        willChange: isDragging ? 'transform' : 'auto',
        zIndex: isDragging ? 999 : 'auto',
        opacity: isDragging ? 0.4 : 1,
        boxShadow: isDragging ? '0 0 0 1px rgba(63, 63, 70, 0.1), 0 4px 8px -2px rgba(63, 63, 70, 0.1), 0 2px 4px -2px rgba(63, 63, 70, 0.1)' : 'none',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="space-y-3 rounded-lg border bg-muted/20 p-4 transition-shadow duration-200 hover:shadow-md"
        >
            <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                <img
                    src={getStorageUrl(image.image_url)}
                    alt={image.alt_text}
                    className={`size-full object-cover ${isDragging ? 'pointer-events-none' : ''}`}
                    draggable={false}
                />
                <div className="absolute top-2 left-2 flex gap-1">
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        {...attributes}
                        {...listeners}
                        className="bg-background/80 hover:bg-background cursor-grab active:cursor-grabbing"
                    >
                        <GripVertical />
                    </Button>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        onClick={() => setFeaturedImage(index)}
                        className={image.is_featured ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-background/80 hover:bg-background'}
                    >
                        <Star />
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        onClick={() => removeImage(index)}
                        className="bg-red-500 text-white hover:bg-red-600"
                    >
                        <Trash2 />
                    </Button>
                </div>
                {image.is_featured && <Badge className="absolute bottom-2 left-2 rounded-sm bg-yellow-500 text-white">Image principale</Badge>}
            </div>
            <div className="*:not-first:mt-2">
                <Label htmlFor={`alt_text-${index}`}>Texte alternatif</Label>
                <Input
                    id={`alt_text-${index}`}
                    value={image.alt_text}
                    onChange={(e) => handleImageAltChange(index, e.target.value)}
                    className="bg-background"
                    placeholder="Produit - Vue de côté"
                />
            </div>
        </div>
    );
}
