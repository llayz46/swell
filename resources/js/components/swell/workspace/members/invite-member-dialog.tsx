import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { CheckIcon, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { useWorkspaceMembersStore } from '@/stores/workspace-members-store';
import { FormEventHandler, useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import type { SharedData } from '@/types';

type InviteMemberFormData = {
    team_id: number | null;
    user_id: number | null;
    message: string;
};

export function InviteMemberDialog() {
    const { user } = usePage<SharedData>().props.auth; 
    const [memberDropdownOpen, setMemberDropdownOpen] = useState<boolean>(false);

    const { 
        members,
        inviteMemberDialogOpen,
        closeInviteMemberDialog,
        inviteMemberTeamId
    } = useWorkspaceMembersStore();

    const { data, setData, post, processing, errors, reset } = useForm<InviteMemberFormData>({
        team_id: null,
        user_id: null,
        message: ''
    });
    
    useEffect(() => {
        if (inviteMemberTeamId) setData('team_id', inviteMemberTeamId);
    }, [inviteMemberTeamId]);
    
    const filteredMembers = inviteMemberTeamId
        ? members.filter((m) => !m.teams.some(team => team.id === inviteMemberTeamId) && m.id !== user.id)
        : members.filter((m) => m.id !== user.id);
    const selectedMember = filteredMembers.find((m) => m.id === data.user_id);
    
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('workspace.teams.invite', { team: data.team_id }), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                closeInviteMemberDialog();
                toast.success(`Invitation envoyée à ${selectedMember?.name}`);
            },
            onError: (errors) => {
                const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';
                toast.error(`Erreur lors de l'envoi de l'invitation à ${selectedMember?.name}`, {
                    description: allErrors,
                });
            },
        });
    }

    return (
        <Dialog open={inviteMemberDialogOpen} onOpenChange={closeInviteMemberDialog}>
            <DialogContent className="shadow-dialog flex max-h-[calc(100vh-32px)] flex-col gap-0 overflow-y-visible border-transparent p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
                <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b px-6 py-4 text-base">Inviter un membre</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">Inviter un membre à rejoindre l'équipe</DialogDescription>
                <div className="overflow-y-auto">
                    <div className="pt-4">
                        <form className="space-y-4 *:not-last:px-6" onSubmit={submit}>
                            <div className="*:not-first:mt-2">
                                <Label htmlFor="user_id">Membre</Label>
                                <Popover open={memberDropdownOpen} onOpenChange={setMemberDropdownOpen} modal={true}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={memberDropdownOpen}
                                            className="w-full justify-between"
                                            disabled={processing}
                                        >
                                            {selectedMember ? (
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="size-5">
                                                        <AvatarImage src={selectedMember.avatar_url} alt={selectedMember.name} />
                                                        <AvatarFallback className="text-xs">
                                                            {selectedMember.name
                                                                .split(' ')
                                                                .map((n) => n[0])
                                                                .join('')
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {selectedMember.name}
                                                </div>
                                            ) : (
                                                'Sélectionnez un membre'
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
                                                    {filteredMembers.map((member) => (
                                                        <CommandItem
                                                            key={member.id}
                                                            value={member.name}
                                                            keywords={[member.name, member.email]}
                                                            onSelect={() => {
                                                                setData('user_id', member.id);
                                                                setMemberDropdownOpen(false);
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
                                                            {data.user_id === member.id && <CheckIcon size={16} />}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <InputError message={errors.user_id} />
                            </div>

                            <div className="*:not-first:mt-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    className="bg-transparent!"
                                    id="message"
                                    placeholder="Message d'invitation"
                                    rows={4}
                                    onChange={(e) => setData('message', e.target.value)}
                                    value={data.message}
                                    disabled={processing}
                                />
                                <InputError message={errors.message} />
                            </div>

                            <DialogFooter className="border-t px-6 py-4">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Annuler
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                                    Inviter {selectedMember?.name || ''} dans l'équipe
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
