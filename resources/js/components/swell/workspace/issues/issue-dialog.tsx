import InputError from '@/components/input-error';
import { DatePickerInput } from '@/components/swell/date-picker-input';
import { PriorityIcon, StatusIcon } from '@/components/swell/workspace/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import { useForm } from '@inertiajs/react';
import { CheckIcon, ChevronsUpDown, LoaderCircle, X } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface IssueDialogProps {
    teamId: number;
}

type IssueFormData = {
    title: string;
    description: string;
    status_id: number;
    priority_id: number;
    assignee_id: number | null;
    label_ids: number[];
    due_date: string;
    team_id: number;
};

export function IssueDialog({ teamId }: IssueDialogProps) {
    const [statusOpen, setStatusOpen] = useState<boolean>(false);
    const [priorityOpen, setPriorityOpen] = useState<boolean>(false);
    const [assigneeOpen, setAssigneeOpen] = useState<boolean>(false);
    const [labelsOpen, setLabelsOpen] = useState<boolean>(false);

    const { statuses, priorities, labels, team, issueDialogOpen, issueDialogIssue, issueDialogStatusId, closeIssueDialog } =
        useWorkspaceIssuesStore();

    const isEditMode = !!issueDialogIssue;

    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm<IssueFormData>({
        title: '',
        description: '',
        status_id: statuses[0]?.id || 0,
        priority_id: priorities[0]?.id || 0,
        assignee_id: null,
        label_ids: [],
        due_date: '',
        team_id: teamId,
    });

    useEffect(() => {
        if (!issueDialogOpen) {
            reset();
            clearErrors();
        }
    }, [issueDialogOpen, reset, clearErrors]);

    useEffect(() => {
        if (issueDialogOpen) {
            clearErrors();
            if (issueDialogIssue) {
                setData({
                    title: issueDialogIssue.title,
                    description: issueDialogIssue.description || '',
                    status_id: issueDialogIssue.status.id,
                    priority_id: issueDialogIssue.priority.id,
                    assignee_id: issueDialogIssue.assignee?.id || null,
                    label_ids: issueDialogIssue.labels.map((l) => l.id),
                    due_date: issueDialogIssue.dueDate || '',
                    team_id: teamId,
                });
            } else {
                reset();
                if (issueDialogStatusId) {
                    setData('status_id', issueDialogStatusId);
                }
            }
        }
    }, [issueDialogOpen, issueDialogIssue, issueDialogStatusId, clearErrors]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEditMode && issueDialogIssue) {
            patch(route('workspace.issues.update', { issue: issueDialogIssue.id }), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    closeIssueDialog();
                    toast.success('Tâche modifiée avec succès');
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';
                    toast.error('Erreur lors de la modification de la tâche', {
                        description: allErrors,
                    });
                },
            });
        } else {
            post(route('workspace.issues.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    closeIssueDialog();
                    toast.success('Tâche créée avec succès');
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';
                    toast.error('Erreur lors de la création de la tâche', {
                        description: allErrors,
                    });
                },
            });
        }
    };

    const selectedStatus = statuses.find((s) => s.id === data.status_id);
    const selectedPriority = priorities.find((p) => p.id === data.priority_id);
    const selectedAssignee = team?.members?.find((m) => m.id === data.assignee_id);
    const selectedLabels = labels.filter((l) => data.label_ids.includes(l.id));

    const toggleLabel = (labelId: number) => {
        setData('label_ids', data.label_ids.includes(labelId) ? data.label_ids.filter((id) => id !== labelId) : [...data.label_ids, labelId]);
    };

    const removeLabel = (labelId: number) => {
        setData(
            'label_ids',
            data.label_ids.filter((id) => id !== labelId),
        );
    };

    return (
        <Dialog open={issueDialogOpen} onOpenChange={closeIssueDialog}>
            <DialogContent className="shadow-dialog flex max-h-[calc(100vh-32px)] flex-col gap-0 overflow-y-visible border-transparent p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
                <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b px-6 py-4 text-base">{isEditMode ? 'Modifier la tâche' : 'Nouvelle tâche'}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">{isEditMode ? 'Modifier la tâche' : 'Nouvelle tâche'}</DialogDescription>
                <div className="overflow-y-auto">
                    <div className="pt-4">
                        <form className="space-y-4 *:not-last:px-6" onSubmit={submit}>
                            <div className="*:not-first:mt-2">
                                <Label htmlFor="title">Titre</Label>
                                <Input
                                    id="title"
                                    placeholder="Titre de la tâche"
                                    type="text"
                                    required
                                    onChange={(e) => setData('title', e.target.value)}
                                    value={data.title}
                                    disabled={processing}
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="*:not-first:mt-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    className="bg-transparent!"
                                    id="description"
                                    placeholder="Description de la tâche"
                                    rows={4}
                                    onChange={(e) => setData('description', e.target.value)}
                                    value={data.description}
                                    disabled={processing}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="*:not-first:mt-2">
                                    <Label htmlFor="status">Statut</Label>
                                    <Popover open={statusOpen} onOpenChange={setStatusOpen} modal={true}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={statusOpen}
                                                className="w-full justify-between"
                                                disabled={processing}
                                            >
                                                {selectedStatus ? (
                                                    <div className="flex items-center gap-2">
                                                        <StatusIcon iconType={selectedStatus.icon_type} color={selectedStatus.color} size={14} />
                                                        {selectedStatus.name}
                                                    </div>
                                                ) : (
                                                    'Sélectionner un statut'
                                                )}
                                                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full min-w-(--radix-popper-anchor-width) border-input p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Rechercher un statut..." />
                                                <CommandList>
                                                    <CommandEmpty>Aucun statut trouvé.</CommandEmpty>
                                                    <CommandGroup>
                                                        {statuses.map((status) => (
                                                            <CommandItem
                                                                key={status.id}
                                                                value={status.slug}
                                                                keywords={[status.name, status.slug]}
                                                                onSelect={() => {
                                                                    setData('status_id', status.id);
                                                                    setStatusOpen(false);
                                                                }}
                                                                className="flex items-center justify-between"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <StatusIcon iconType={status.icon_type} color={status.color} size={14} />
                                                                    {status.name}
                                                                </div>
                                                                {data.status_id === status.id && <CheckIcon size={16} />}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <InputError message={errors.status_id} />
                                </div>

                                <div className="*:not-first:mt-2">
                                    <Label htmlFor="priority">Priorité</Label>
                                    <Popover open={priorityOpen} onOpenChange={setPriorityOpen} modal={true}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={priorityOpen}
                                                className="w-full justify-between"
                                                disabled={processing}
                                            >
                                                {selectedPriority ? (
                                                    <div className="flex items-center gap-2">
                                                        <PriorityIcon iconType={selectedPriority.icon_type} width={14} height={14} />
                                                        {selectedPriority.name}
                                                    </div>
                                                ) : (
                                                    'Sélectionner une priorité'
                                                )}
                                                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full min-w-(--radix-popper-anchor-width) border-input p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Rechercher une priorité..." />
                                                <CommandList>
                                                    <CommandEmpty>Aucune priorité trouvée.</CommandEmpty>
                                                    <CommandGroup>
                                                        {priorities.map((priority) => (
                                                            <CommandItem
                                                                key={priority.id}
                                                                value={priority.slug}
                                                                keywords={[priority.name, priority.slug]}
                                                                onSelect={() => {
                                                                    setData('priority_id', priority.id);
                                                                    setPriorityOpen(false);
                                                                }}
                                                                className="flex items-center justify-between"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <PriorityIcon iconType={priority.icon_type} width={14} height={14} />
                                                                    {priority.name}
                                                                </div>
                                                                {data.priority_id === priority.id && <CheckIcon size={16} />}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <InputError message={errors.priority_id} />
                                </div>
                            </div>

                            <div className="*:not-first:mt-2">
                                <Label htmlFor="assignee">Assigné à</Label>
                                <Popover open={assigneeOpen} onOpenChange={setAssigneeOpen} modal={true}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={assigneeOpen}
                                            className="w-full justify-between"
                                            disabled={processing}
                                        >
                                            {selectedAssignee ? (
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="size-5">
                                                        <AvatarImage src={selectedAssignee.avatar_url} alt={selectedAssignee.name} />
                                                        <AvatarFallback className="text-xs">
                                                            {selectedAssignee.name
                                                                .split(' ')
                                                                .map((n) => n[0])
                                                                .join('')
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {selectedAssignee.name}
                                                </div>
                                            ) : (
                                                'Non assigné'
                                            )}
                                            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full min-w-(--radix-popper-anchor-width) border-input p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Rechercher un membre..." />
                                            <CommandList>
                                                <CommandEmpty>Aucun membre trouvé.</CommandEmpty>
                                                <CommandGroup>
                                                    <CommandItem
                                                        value="unassigned"
                                                        onSelect={() => {
                                                            setData('assignee_id', null);
                                                            setAssigneeOpen(false);
                                                        }}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="size-5">
                                                                <AvatarFallback className="text-xs">?</AvatarFallback>
                                                            </Avatar>
                                                            Non assigné
                                                        </div>
                                                        {data.assignee_id === null && <CheckIcon size={16} />}
                                                    </CommandItem>
                                                    {team?.members?.map((member) => (
                                                        <CommandItem
                                                            key={member.id}
                                                            value={member.name}
                                                            keywords={[member.name, member.email]}
                                                            onSelect={() => {
                                                                setData('assignee_id', member.id);
                                                                setAssigneeOpen(false);
                                                            }}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="size-5">
                                                                    <AvatarImage src={member.avatar_url} alt={member.name} />
                                                                    <AvatarFallback className="text-xs">
                                                                        {member.name
                                                                            .split(' ')
                                                                            .map((n) => n[0])
                                                                            .join('')
                                                                            .toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                {member.name}
                                                            </div>
                                                            {data.assignee_id === member.id && <CheckIcon size={16} />}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <InputError message={errors.assignee_id} />
                            </div>

                            <div className="*:not-first:mt-2">
                                <Label htmlFor="labels">Étiquettes</Label>
                                <Popover open={labelsOpen} onOpenChange={setLabelsOpen} modal={true}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={labelsOpen}
                                            className="w-full justify-between"
                                            disabled={processing}
                                        >
                                            <span className="truncate">
                                                {selectedLabels.length > 0
                                                    ? `${selectedLabels.length} étiquette${selectedLabels.length > 1 ? 's' : ''} sélectionné${selectedLabels.length > 1 ? 's' : ''}`
                                                    : 'Sélectionner des étiquettes'}
                                            </span>
                                            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full min-w-(--radix-popper-anchor-width) border-input p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Rechercher une étiquette..." />
                                            <CommandList>
                                                <CommandEmpty>Aucune étiquette trouvée.</CommandEmpty>
                                                <CommandGroup>
                                                    {labels.map((label) => (
                                                        <CommandItem
                                                            key={label.id}
                                                            value={label.slug}
                                                            keywords={[label.name, label.slug]}
                                                            onSelect={() => toggleLabel(label.id)}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className="size-2 rounded-full"
                                                                    style={{ backgroundColor: label.color }}
                                                                    aria-hidden="true"
                                                                />
                                                                {label.name}
                                                            </div>
                                                            {data.label_ids.includes(label.id) && <CheckIcon size={16} />}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {selectedLabels.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedLabels.map((label) => (
                                            <Badge key={label.id} variant="outline" className="gap-1.5 rounded-full">
                                                <span className="size-1.5 rounded-full" style={{ backgroundColor: label.color }} aria-hidden="true" />
                                                {label.name}
                                                <button
                                                    type="button"
                                                    onClick={() => removeLabel(label.id)}
                                                    className="ml-1 rounded-full hover:bg-muted"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                                <InputError message={errors.label_ids} />
                            </div>

                            <div className="*:not-first:mt-2">
                                <Label htmlFor="due_date">Date d'échéance</Label>
                                <DatePickerInput
                                    value={data.due_date}
                                    onChange={(date) => setData('due_date', date)}
                                    placeholder="Sélectionner une date d'échéance"
                                    disabled={processing}
                                />
                                <InputError message={errors.due_date} />
                            </div>

                            <DialogFooter className="border-t px-6 py-4">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Annuler
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                                    {isEditMode ? 'Modifier' : 'Créer'} la tâche
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
