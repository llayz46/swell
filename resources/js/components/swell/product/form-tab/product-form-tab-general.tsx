import InputError from '@/components/input-error';
import { BrandDialog } from '@/components/swell/brand-dialog';
import { CategoryTree } from '@/components/swell/category-tree';
import { CollectionDialog } from '@/components/swell/product/collection-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCharacterLimit } from '@/hooks/use-character-limit';
import { cn } from '@/lib/utils';
import type { FormTabContentProps, ProductForm } from '@/types';
import { CheckIcon, ChevronDownIcon, CirclePlus, Minus, PenLine, X } from 'lucide-react';
import { useState } from 'react';
import slugify from 'slugify';
import { toast } from 'sonner';

export function GeneralTabContent({ data, setData, brands, collections, processing, errors }: FormTabContentProps<ProductForm>) {
    const [openBrand, setOpenBrand] = useState<boolean>(false);
    const [openCollections, setOpenCollections] = useState<boolean>(false);
    const [openBrandDialog, setOpenBrandDialog] = useState<boolean>(false);
    const [openCollectionDialog, setOpenCollectionDialog] = useState<boolean>(false);
    const [brandInputValue, setBrandInputValue] = useState<string>('');
    const [finalizedOptionIds, setFinalizedOptionIds] = useState<number[]>(data.options?.filter(option => option.id !== null).map(option => option.id as number) || []);

    const maxLength = 500;
    const { maxLength: limit } = useCharacterLimit({
        maxLength,
    });

    const addNewOption = () => {
        setData('options', [...data.options, { id: data.options.length + 1, name: '', values: [{ id: null, value: '' }] }]);
    };

    const deleteOption = (optionId: number) => {
        setData(
            'options',
            data.options.filter((v) => v.id !== optionId),
        );

        setFinalizedOptionIds((prev) => prev.filter((id) => id !== optionId));
    };

    const toggleFinalizeOption = (option: {
        id: number | null;
        name: string;
        values: {
            id: number | null;
            value: string;
        }[];
    }) => {
        if (option.name === '' || option.values?.length === 0 || option.values?.some((v) => v.value.trim() === '')) {
            toast.error("Erreur de configuration de l'option", {
                description: "Le nom de l'option et chacune de ses valeurs doivent être renseignés.",
            });
            return;
        }

        setFinalizedOptionIds((prev) =>
            option.id !== null && prev.includes(option.id) ? prev.filter((id) => id !== option.id) : option.id !== null ? [...prev, option.id] : prev,
        );
    };

    return (
        <TabsContent value="general" className="space-y-4">
            <Card className="border-border bg-card max-sm:py-4">
                <CardHeader className="max-sm:px-4">
                    <CardTitle className="text-foreground">Informations de base</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-sm:px-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="*:not-first:mt-2">
                            <Label htmlFor="name">Nom du produit *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                tabIndex={1}
                                disabled={processing}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="T-shirt blanc à motifs"
                            />
                            <InputError message={errors?.name || errors?.slug} />
                        </div>
                        {data.name && (
                            <div className="mt-auto flex h-9 items-center">
                                <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{slugify(data.name.toLowerCase())}</code>
                            </div>
                        )}
                    </div>
                    <div className="*:not-first:mt-2">
                        <Label htmlFor="short_description">Courte description *</Label>
                        <Textarea
                            id="short_description"
                            value={data.short_description}
                            onChange={(e) => setData('short_description', e.target.value)}
                            tabIndex={2}
                            disabled={processing}
                            rows={5}
                            placeholder="Description concise du produit..."
                        />
                        <p
                            id="description"
                            className={`text-xs ${data.short_description.length > limit ? 'text-red-400' : 'text-muted-foreground'}`}
                            role="status"
                            aria-live="polite"
                        >
                            <span className="tabular-nums">{limit - data.short_description.length}</span> caractères restants
                        </p>
                        <InputError message={errors?.short_description} />
                    </div>
                    <div className="*:not-first:mt-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            tabIndex={3}
                            disabled={processing}
                            rows={5}
                            placeholder="Description détaillée du produit..."
                        />
                        <p
                            id="description"
                            className={`text-xs ${data.description.length > 1000 ? 'text-red-400' : 'text-muted-foreground'}`}
                            role="status"
                            aria-live="polite"
                        >
                            <span className="tabular-nums">{1000 - data.description.length}</span> caractères restants
                        </p>
                        <InputError message={errors?.description} />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border bg-card max-sm:py-4">
                <CardHeader className="max-sm:px-4">
                    <CardTitle className="text-foreground">Organisation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-sm:px-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-4">
                            <div className="*:not-first:mt-2">
                                <Label htmlFor="brand">Marque du produit *</Label>
                                <Popover open={openBrand} onOpenChange={setOpenBrand}>
                                    <PopoverTrigger asChild tabIndex={4} disabled={processing}>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openBrand}
                                            className="w-full justify-between border-input bg-background px-3 font-normal outline-offset-0 outline-none hover:bg-background focus-visible:outline-[3px]"
                                        >
                                            <span className={cn('truncate', !data.brand_id && 'text-muted-foreground')}>
                                                {data.brand_id
                                                    ? brands?.find((brand) => brand.id === data.brand_id)?.name
                                                    : 'Sélectionner une marque'}
                                            </span>
                                            <ChevronDownIcon size={16} className="shrink-0 text-muted-foreground/80" aria-hidden="true" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Rechercher une marque..." onValueChange={(e) => setBrandInputValue(e)} />
                                            <CommandList>
                                                <CommandEmpty>
                                                    <BrandDialog
                                                        open={openBrandDialog}
                                                        setOpen={() => {
                                                            setOpenBrandDialog(!openBrandDialog);
                                                        }}
                                                        brand={null}
                                                        inputValue={brandInputValue}
                                                    />
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {brands?.map((brand) => (
                                                        <CommandItem
                                                            key={brand.id}
                                                            value={brand.name}
                                                            onSelect={() => {
                                                                setData('brand_id', brand.id);
                                                                setOpenBrand(false);
                                                            }}
                                                        >
                                                            {brand.name}
                                                            {data.brand_id === brand.id && <CheckIcon size={16} className="ml-auto" />}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <InputError message={errors?.brand_id} />
                            </div>
                            <div className="*:not-first:mt-2">
                                <Label htmlFor="collection">Collection de produits</Label>
                                <Popover open={openCollections} onOpenChange={setOpenCollections}>
                                    <PopoverTrigger asChild tabIndex={5} disabled={processing}>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openCollections}
                                            className="w-full justify-between border-input bg-background px-3 font-normal outline-offset-0 outline-none hover:bg-background focus-visible:outline-[3px]"
                                        >
                                            <span
                                                className={cn(
                                                    'truncate',
                                                    (data.collection_id === null || data.collection_id === undefined) && 'text-muted-foreground',
                                                )}
                                            >
                                                {data.collection_id
                                                    ? (collections?.find((collection) => String(collection.id) === data.collection_id)?.title ??
                                                      'Sélectionner une collection')
                                                    : 'Aucune collection'}
                                            </span>
                                            <ChevronDownIcon size={16} className="shrink-0 text-muted-foreground/80" aria-hidden="true" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Rechercher une collection..." />
                                            <CommandList>
                                                <CommandEmpty>
                                                    <CollectionDialog
                                                        open={openCollectionDialog}
                                                        setOpen={() => {
                                                            setOpenCollectionDialog(!openCollectionDialog);
                                                        }}
                                                    />
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {collections?.map((collection) => (
                                                        <CommandItem
                                                            key={collection.id}
                                                            value={collection.title}
                                                            onSelect={() => {
                                                                setData('collection_id', String(collection.id));
                                                                setOpenCollections(false);
                                                            }}
                                                        >
                                                            <span className="flex flex-col gap-1">
                                                                {collection.title}
                                                                <span className="text-xs text-wrap text-muted-foreground">
                                                                    {collection.products.map((product, index) => (
                                                                        <span key={product.id} className="ml-1 text-xs text-muted-foreground">
                                                                            {product.name} {index < collection.products.length - 1 ? ',' : ''}
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                            </span>
                                                            {data.collection_id === String(collection.id) && (
                                                                <CheckIcon size={16} className="ml-auto" />
                                                            )}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <InputError message={errors?.collection_id} />
                            </div>
                        </div>
                        <div className="*:not-first:mt-2">
                            <CategoryTree
                                onlyChildren
                                label={{ htmlFor: 'category_id', name: 'Catégorie *' }}
                                field="category_id"
                                setData={setData}
                                initialSelectedItem={String(data.category_id)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border bg-card max-sm:py-4">
                <CardHeader className="max-sm:px-4">
                    <CardTitle className="text-foreground">Variantes</CardTitle>
                </CardHeader>
                <CardContent className="max-sm:px-4">
                    <Button size="sm" variant="outline" type="button" onClick={addNewOption} className={cn(data.options.length > 0 && 'hidden')}>
                        <CirclePlus />
                        Ajouter des options comme la taille, la couleur, etc.
                    </Button>
                    <Card className={cn('hidden gap-0 rounded-md p-0', data.options.length > 0 && 'flex')}>
                        <CardContent className="p-0 *:not-last:border-b">
                            {data.options.map((option) => (
                                <div key={option.id}>
                                    {finalizedOptionIds.includes(option.id as number) ? (
                                        <div className="relative space-y-2 p-4">
                                            <p>{option.name}</p>
                                            <ul className="space-y-1">
                                                {option.values.map((v, index) => (
                                                    <li key={index} className="w-fit rounded bg-muted px-1.5 py-1 text-sm text-muted-foreground">
                                                        {v.value}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="absolute top-4 right-4 flex gap-2 *:rounded *:border *:border-transparent *:p-0.25 *:transition *:hover:border-border">
                                                <button type="button" onClick={() => toggleFinalizeOption(option)}>
                                                    <PenLine size={16} />
                                                </button>
                                                <button type="button" onClick={() => deleteOption(option.id as number)}>
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 p-4">
                                            <div className="*:not-first:mt-2">
                                                <Label>Nom de l'option</Label>
                                                <Input
                                                    placeholder="Couleur"
                                                    value={option.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'options',
                                                            data.options.map((o) =>
                                                                o.id === option.id
                                                                    ? {
                                                                          ...o,
                                                                          name: e.target.value,
                                                                      }
                                                                    : o,
                                                            ),
                                                        )
                                                    }
                                                />
                                                <InputError />
                                            </div>
                                            <div className="*:not-first:mt-2">
                                                <Label>Valeur de l'option</Label>
                                                {option.values?.map((v, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <Input
                                                            placeholder="Rouge"
                                                            value={v.value}
                                                            onChange={(e) =>
                                                                setData(
                                                                    'options',
                                                                    data.options.map((o) =>
                                                                        o.id === option.id
                                                                            ? {
                                                                                  ...o,
                                                                                  values: o.values.map((v, i) =>
                                                                                      i === index
                                                                                          ? {
                                                                                                ...v,
                                                                                                value: e.target.value,
                                                                                            }
                                                                                          : v,
                                                                                  ),
                                                                              }
                                                                            : o,
                                                                    ),
                                                                )
                                                            }
                                                        />

                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            type="button"
                                                            className={cn(option.values.length === 1 && 'hidden')}
                                                            onClick={() => {
                                                                if (option.values.length === 1) return;

                                                                setData(
                                                                    'options',
                                                                    data.options.map((o) =>
                                                                        o.id === option.id
                                                                            ? {
                                                                                  ...o,
                                                                                  values: o.values.filter((_, i) => i !== index),
                                                                              }
                                                                            : o,
                                                                    ),
                                                                );
                                                            }}
                                                        >
                                                            <Minus />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <InputError />
                                                <button
                                                    type="button"
                                                    className="text-xs text-muted-foreground"
                                                    onClick={() =>
                                                        setData(
                                                            'options',
                                                            data.options.map((o) =>
                                                                o.id === option.id
                                                                    ? {
                                                                          ...o,
                                                                          values: [
                                                                              ...(o.values ?? []),
                                                                              {
                                                                                  id: null,
                                                                                  value: '',
                                                                              },
                                                                          ],
                                                                      }
                                                                    : o,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    Ajouter une autre valeur
                                                </button>
                                            </div>

                                            <div className="flex justify-between pt-1">
                                                <Button
                                                    size="xs"
                                                    variant="destructive"
                                                    type="button"
                                                    onClick={() => deleteOption(option.id as number)}
                                                >
                                                    Supprimer
                                                </Button>
                                                <Button size="xs" variant="secondary" type="button" onClick={() => toggleFinalizeOption(option)}>
                                                    Terminé
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>

                        <CardFooter className="border-t p-0">
                            <button
                                className="flex size-full items-center gap-2 rounded-b-md px-4 py-2.5 text-sm font-medium hover:bg-muted"
                                type="button"
                                onClick={addNewOption}
                            >
                                <CirclePlus size={16} />
                                Ajouter une autre option
                            </button>
                        </CardFooter>
                    </Card>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
