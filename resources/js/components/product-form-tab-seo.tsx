import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { FormTabContentProps, ProductForm } from '@/types';

export function SeoTabContent({ data, setData, processing, errors }: FormTabContentProps<ProductForm>) {
    return (
        <TabsContent value="seo" className="space-y-4">
            <Card className="max-sm:py-4 border-border bg-card">
                <CardHeader className="max-sm:px-4">
                    <CardTitle className="text-foreground">Optimisation SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-sm:px-4">
                    <div className="*:not-first:mt-2">
                        <Label htmlFor="meta_title">Titre Meta</Label>
                        <Input
                            id="meta_title"
                            tabIndex={1}
                            disabled={processing}
                            value={data.meta_title ?? ''}
                            onChange={(e) => setData('meta_title', e.target.value)}
                            type="text"
                            placeholder="Titre pour les moteurs de recherche"
                        />
                        <p className="text-xs text-muted-foreground">
                            {data.meta_title ? data.meta_title.length : 0}/60 caractères recommandés
                        </p>
                        <InputError message={errors && errors.meta_title} />
                    </div>
                    <div className="*:not-first:mt-2">
                        <Label htmlFor="meta_description">Description Meta</Label>
                        <Textarea
                            id="meta_description"
                            tabIndex={2}
                            disabled={processing}
                            value={data.meta_description ?? ''}
                            onChange={(e) => setData('meta_description', e.target.value)}
                            placeholder="Description pour les moteurs de recherche"
                            rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                            {data.meta_description ? data.meta_description.length : 0}/160 caractères recommandés
                        </p>
                        <InputError message={errors && errors.meta_description} />
                    </div>
                    <div className="*:not-first:mt-2">
                        <Label htmlFor="meta_keywords">Mots-clés</Label>
                        <Input
                            id="meta_keywords"
                            tabIndex={3}
                            disabled={processing}
                            value={data.meta_keywords ?? ''}
                            onChange={(e) => setData('meta_keywords', e.target.value)}
                            placeholder="mot-clé1, mot-clé2, mot-clé3"
                        />
                        <InputError message={errors && errors.meta_keywords} />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    )
}
