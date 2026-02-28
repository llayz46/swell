import { store, update } from '@/actions/App/Modules/Workspace/Http/Controllers/WorkspaceTeamController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useWorkspaceRole } from '@/hooks/use-workspace-role';
import { cn } from '@/lib/utils';
import { useWorkspaceTeamsStore } from '@/stores/workspace-teams-store';
import { useForm } from '@inertiajs/react';
import { CheckIcon, LoaderCircle, Smile } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { sileo } from 'sileo';

type TeamFormData = {
    name: string;
    identifier: string;
    icon: string;
    color: string;
    description: string;
};

const COMMON_EMOJIS = [
    '🚀',
    '💼',
    '🎯',
    '⚡',
    '🔥',
    '💡',
    '🎨',
    '🛠️',
    '📊',
    '💻',
    '🌟',
    '🎭',
    '🏆',
    '🎪',
    '🎬',
    '🎮',
    '🎲',
    '🎸',
    '🎹',
    '🎺',
    '🎻',
    '🥁',
    '🎤',
    '📱',
    '💾',
    '🖥️',
    '⌨️',
    '🖱️',
    '🖨️',
    '📷',
    '📹',
];

const TEAM_COLORS = [
    { name: 'Ardoise', value: '#64748b' },
    { name: 'Rouge', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Ambre', value: '#f59e0b' },
    { name: 'Jaune', value: '#eab308' },
    { name: 'Citron vert', value: '#84cc16' },
    { name: 'Vert', value: '#22c55e' },
    { name: 'Émeraude', value: '#10b981' },
    { name: 'Sarcelle', value: '#14b8a6' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Ciel', value: '#0ea5e9' },
    { name: 'Bleu', value: '#3b82f6' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Pourpre', value: '#a855f7' },
    { name: 'Fuchsia', value: '#d946ef' },
    { name: 'Rose', value: '#ec4899' },
    { name: 'Rose vif', value: '#f43f5e' },
];

export function TeamDialog() {
    const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
    const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);

    const { teamDialogOpen, closeTeamDialog, selectedTeamDialog } = useWorkspaceTeamsStore();
    const { isAdmin } = useWorkspaceRole();

    const { data, setData, post, put, processing, errors, reset } = useForm<TeamFormData>({
        name: '',
        identifier: '',
        icon: '',
        color: '',
        description: '',
    });

    const isEditing = !!selectedTeamDialog;

    useEffect(() => {
        if (selectedTeamDialog) {
            setData({
                name: selectedTeamDialog.name,
                identifier: selectedTeamDialog.identifier,
                icon: selectedTeamDialog.icon ?? '',
                color: selectedTeamDialog.color,
                description: selectedTeamDialog.description ?? '',
            });
        } else {
            reset();
        }
    }, [selectedTeamDialog]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const submitMethod = isEditing ? put : post;

        if (!isEditing && !isAdmin) return sileo.error({ title: "Vous n'avez pas les droits pour " + (isEditing ? 'modifier' : 'créer') + ' une équipe' });

        const submitRoute = isEditing ? update.url(selectedTeamDialog!.id) : store.url();

        submitMethod(submitRoute, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                closeTeamDialog();
                sileo.success({ title: isEditing ? 'Équipe modifiée avec succès' : 'Équipe créée avec succès' });
            },
            onError: (errors) => {
                const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';
                sileo.error({ title: 'Erreur lors de ' + (isEditing ? 'la modification' : 'la création') + " de l'équipe", description: allErrors });
            },
        });
    };

    return (
        <Dialog open={teamDialogOpen} onOpenChange={closeTeamDialog}>
            <DialogContent className="shadow-dialog flex max-h-[calc(100vh-32px)] flex-col gap-0 overflow-y-visible border-transparent p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
                <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b px-6 py-4 text-base">{isEditing ? "Modifier l'équipe" : 'Créer une équipe'}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">{isEditing ? "Modifier l'équipe" : 'Créer une équipe'}</DialogDescription>
                <div className="overflow-y-auto">
                    <div className="pt-4">
                        <form className="space-y-4 *:not-last:px-6" onSubmit={submit}>
                            <div className="grid grid-cols-8 gap-4">
                                <div className="col-span-6 *:not-first:mt-2">
                                    <Label htmlFor="name">Nom</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nom de l'équipe"
                                    />
                                    {errors.name && <InputError message={errors.name} />}
                                </div>

                                <div className="col-span-2 *:not-first:mt-2">
                                    <Label htmlFor="identifier">Identifiant</Label>
                                    <Input
                                        id="identifier"
                                        value={data.identifier}
                                        onChange={(e) => setData('identifier', e.target.value)}
                                        placeholder="Identifiant"
                                    />
                                    {errors.identifier && <InputError message={errors.identifier} />}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="*:not-first:mt-2">
                                    <Label>Icône</Label>
                                    <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
                                        <PopoverTrigger asChild>
                                            <Button type="button" variant="outline" className="h-10 w-full justify-start gap-2 px-3 text-xl">
                                                {data.icon ? (
                                                    <>
                                                        <span>{data.icon}</span>
                                                        <span className="text-sm text-muted-foreground">Changer</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Smile className="size-4" />
                                                        <span className="text-sm text-muted-foreground">Choisir une icône</span>
                                                    </>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64 p-2">
                                            <div className="grid grid-cols-8 gap-1">
                                                {COMMON_EMOJIS.map((emoji) => (
                                                    <button
                                                        key={emoji}
                                                        type="button"
                                                        className="flex size-8 items-center justify-center rounded text-lg hover:bg-accent"
                                                        onClick={() => {
                                                            setData('icon', emoji);
                                                            setEmojiPickerOpen(false);
                                                        }}
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="*:not-first:mt-2">
                                    <Label>Couleur</Label>
                                    <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen} modal={true}>
                                        <PopoverTrigger asChild>
                                            <Button type="button" variant="outline" className="h-10 w-full justify-start gap-2 px-3">
                                                <div className="size-4 rounded border" style={{ backgroundColor: data.color || '#64748b' }} />
                                                <span className="text-sm text-muted-foreground">
                                                    {TEAM_COLORS.find((c) => c.value === data.color)?.name || 'Choisir'}
                                                </span>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                                            <ScrollArea className="max-h-60 overflow-y-auto">
                                                <div className="flex flex-col p-1">
                                                    {TEAM_COLORS.map((color) => (
                                                        <button
                                                            key={color.value}
                                                            type="button"
                                                            className={cn(
                                                                'flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors hover:bg-accent',
                                                                data.color === color.value && 'bg-accent',
                                                            )}
                                                            onClick={() => {
                                                                setData('color', color.value);
                                                                setColorPickerOpen(false);
                                                            }}
                                                        >
                                                            <div
                                                                className="size-4 shrink-0 rounded border"
                                                                style={{ backgroundColor: color.value }}
                                                            />
                                                            <span className="flex-1 text-left">{color.name}</span>
                                                            {data.color === color.value && <CheckIcon className="size-4 shrink-0" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="*:not-first:mt-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Description de l'équipe..."
                                    rows={3}
                                />
                                {errors.description && <InputError message={errors.description} />}
                            </div>

                            <DialogFooter className="border-t px-6 py-4">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Annuler
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                                    {isEditing ? "Modifier l'équipe" : "Créer l'équipe"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
