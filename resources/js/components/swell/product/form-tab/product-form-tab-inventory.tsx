import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Button as AriaButton,
    Group,
    Input as AriaInput,
    Label as AriaLabel,
    NumberField
} from 'react-aria-components';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import InputError from '@/components/input-error';
import { FormTabContentProps, ProductForm } from '@/types';

export function InventoryTabContent({ data, setData, errors }: FormTabContentProps<ProductForm>) {
    return (
        <TabsContent value="inventory" className="space-y-4">
            <Card className="max-sm:py-4 border-border bg-card">
                <CardHeader className="max-sm:px-4">
                    <CardTitle className="text-foreground">Gestion des stocks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-sm:px-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <NumberField
                            defaultValue={data.stock}
                            onChange={(value) => setData('stock', value)}
                        >
                            <div className="*:not-first:mt-2">
                                <AriaLabel className="text-foreground text-sm font-medium">
                                    Stock actuel *
                                </AriaLabel>
                                <Group className="border-input doutline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] data-disabled:opacity-50 data-focus-within:ring-[3px]">
                                    <AriaInput className="bg-background text-foreground flex-1 px-3 py-2 tabular-nums" />
                                    <div className="flex h-[calc(100%+2px)] flex-col">
                                        <AriaButton
                                            slot="increment"
                                            className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <ChevronUpIcon size={12} aria-hidden="true" />
                                        </AriaButton>
                                        <AriaButton
                                            slot="decrement"
                                            className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <ChevronDownIcon size={12} aria-hidden="true" />
                                        </AriaButton>
                                    </div>
                                </Group>
                                <InputError message={errors && errors.stock} />
                            </div>
                        </NumberField>
                        <NumberField
                            defaultValue={data.reorder_level}
                            onChange={(value) => setData('reorder_level', value)}
                        >
                            <div className="*:not-first:mt-2">
                                <AriaLabel className="text-foreground text-sm font-medium">
                                    Seuil de réapprovisionnement *
                                </AriaLabel>
                                <Group className="border-input doutline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] data-disabled:opacity-50 data-focus-within:ring-[3px]">
                                    <AriaInput className="bg-background text-foreground flex-1 px-3 py-2 tabular-nums" />
                                    <div className="flex h-[calc(100%+2px)] flex-col">
                                        <AriaButton
                                            slot="increment"
                                            className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <ChevronUpIcon size={12} aria-hidden="true" />
                                        </AriaButton>
                                        <AriaButton
                                            slot="decrement"
                                            className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <ChevronDownIcon size={12} aria-hidden="true" />
                                        </AriaButton>
                                    </div>
                                </Group>
                                <InputError message={errors && errors.reorder_level} />
                            </div>
                        </NumberField>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    )
}
