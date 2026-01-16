import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { MarkdownPreview } from './markdown-preview';

interface CommentEditorProps {
    onSubmit: (content: string) => void;
    onCancel?: () => void;
    isSubmitting?: boolean;
    placeholder?: string;
    initialContent?: string;
    submitLabel?: string;
    showCancel?: boolean;
    autoFocus?: boolean;
}

export function CommentEditor({
    onSubmit,
    onCancel,
    isSubmitting = false,
    placeholder = 'Écrire un commentaire...',
    initialContent = '',
    submitLabel = 'Envoyer',
    showCancel = false,
    autoFocus = false,
}: CommentEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [activeTab, setActiveTab] = useState<string>('write');

    const handleSubmit = () => {
        if (!content.trim() || isSubmitting) return;
        onSubmit(content.trim());
        setContent('');
        setActiveTab('write');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="rounded-lg border border-border bg-card">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between border-b border-border px-3">
                    <TabsList className="h-9 rounded-none bg-transparent p-0">
                        <TabsTrigger
                            value="write"
                            className="rounded-none border-b-2 border-x-0! border-t-0! border-transparent bg-transparent px-4 py-1.5 text-muted-foreground shadow-none hover:text-foreground data-[state=active]:border-x-0! data-[state=active]:border-t-0! data-[state=active]:border-b-primary! data-[state=active]:bg-transparent!"
                        >
                            Écrire
                        </TabsTrigger>
                        <TabsTrigger
                            value="preview"
                            className="rounded-none border-b-2 border-x-0! border-t-0! border-transparent bg-transparent px-4 py-1.5 text-muted-foreground shadow-none hover:text-foreground data-[state=active]:border-x-0! data-[state=active]:border-t-0! data-[state=active]:border-b-primary! data-[state=active]:bg-transparent!"
                        >
                            Aperçu
                        </TabsTrigger>
                    </TabsList>
                    <span className="text-xs text-muted-foreground">Markdown supporté</span>
                </div>

                <TabsContent value="write" className="m-0">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="min-h-[100px] resize-none border-0 focus-visible:ring-0 bg-transparent!"
                        autoFocus={autoFocus}
                    />
                </TabsContent>

                <TabsContent value="preview" className="m-0 min-h-[100px] p-3">
                    {content.trim() ? (
                        <MarkdownPreview content={content} />
                    ) : (
                        <p className="text-sm text-muted-foreground">Rien à prévisualiser</p>
                    )}
                </TabsContent>
            </Tabs>

            <div className="flex items-center justify-between border-t border-border px-3 py-2">
                <p className="text-xs text-muted-foreground">
                    <kbd className="rounded bg-muted px-1 py-0.5 text-[10px]">Ctrl</kbd>
                    {' + '}
                    <kbd className="rounded bg-muted px-1 py-0.5 text-[10px]">Enter</kbd>
                    {' pour envoyer'}
                </p>
                <div className="flex gap-2">
                    {showCancel && (
                        <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting}>
                            Annuler
                        </Button>
                    )}
                    <Button size="sm" onClick={handleSubmit} disabled={!content.trim() || isSubmitting}>
                        {isSubmitting ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                            <Send className="mr-2 size-4" />
                        )}
                        {submitLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
