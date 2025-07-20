import { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import slugify from 'slugify';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { BrandDialog } from '@/components/brand-dialog';
import { ProductGroupDialog } from '@/components/product-group-dialog';
import { CategoryTree } from '@/components/category-tree';
import { FormTabContentProps, ProductForm } from '@/types';
import { useCharacterLimit } from '@/hooks/use-character-limit';

export function GeneralTabContent({ data, setData, brands, groups, processing, errors }: FormTabContentProps<ProductForm>) {
    const [openBrand, setOpenBrand] = useState<boolean>(false)
    const [openGroups, setOpenGroups] = useState<boolean>(false)
    const [openBrandDialog, setOpenBrandDialog] = useState<boolean>(false);
    const [openGroupDialog, setOpenGroupDialog] = useState<boolean>(false);
    const [brandInputValue, setBrandInputValue] = useState<string>('')

    const maxLength = 500
    const {
        maxLength: limit,
    } = useCharacterLimit({
        maxLength
    })

    return (
        <TabsContent value="general" className="space-y-4">
            <Card className="max-sm:py-4 border-border bg-card">
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
                                placeholder="Nom du produit"
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
                            placeholder="Courte description du produit..."
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

            <Card className="max-sm:py-4 border-border bg-card">
                <CardHeader className="max-sm:px-4">
                    <CardTitle className="text-foreground">Marques</CardTitle>
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
                                            className="w-full justify-between border-input bg-background px-3 font-normal outline-offset-0
                                                outline-none hover:bg-background focus-visible:outline-[3px]"
                                        >
                                            <span className={cn('truncate', !data.brand_id && 'text-muted-foreground')}>
                                                {data.brand_id
                                                    ? brands?.find(brand => brand.id === data.brand_id)
                                                        ?.name
                                                    : "Sélectionner une marque"}
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
                                                    {brands?.map(brand => (
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
                                <Label htmlFor="group">Groupe de produits</Label>
                                <Popover open={openGroups} onOpenChange={setOpenGroups}>
                                    <PopoverTrigger asChild tabIndex={5} disabled={processing}>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openGroups}
                                            className="w-full justify-between border-input bg-background px-3 font-normal outline-offset-0 outline-none hover:bg-background focus-visible:outline-[3px]"
                                        >
                                            <span className={cn('truncate', (data.group_id === null || data.group_id === undefined) && 'text-muted-foreground')}>
                                                {data.group_id
                                                    ? groups?.find(group => String(group.id) === data.group_id)?.name ?? 'Sélectionner un groupe'
                                                    : 'Aucun groupe'}
                                            </span>
                                            <ChevronDownIcon size={16} className="shrink-0 text-muted-foreground/80" aria-hidden="true" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Rechercher un groupe..." />
                                            <CommandList>
                                                <CommandEmpty>
                                                    <ProductGroupDialog open={openGroupDialog} setOpen={() => { setOpenGroupDialog(!openGroupDialog) }} />
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {groups?.map(group => (
                                                        <CommandItem
                                                            key={group.id}
                                                            value={group.name}
                                                            onSelect={() => {
                                                                setData('group_id', String(group.id));
                                                                setOpenGroups(false);
                                                            }}
                                                        >
                                                            <span className="flex flex-col gap-1">
                                                                {group.name}
                                                                <span className="text-xs text-muted-foreground text-wrap">
                                                                    {group.products.map((product, index) => (
                                                                        <span key={product.id} className="text-xs text-muted-foreground ml-1">
                                                                            {product.name} {index < group.products.length - 1 ? ',' : ''}
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                            </span>
                                                            {data.group_id === String(group.id) && <CheckIcon size={16} className="ml-auto" />}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <InputError message={errors?.group_id} />
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
        </TabsContent>
    );
}
