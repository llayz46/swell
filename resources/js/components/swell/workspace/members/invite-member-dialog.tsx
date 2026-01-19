import { invite } from '@/actions/App/Modules/Workspace/Http/Controllers/WorkspaceTeamController';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useWorkspaceMembersStore } from '@/stores/workspace-members-store';
import type { SharedData } from '@/types';
import { formatWorkspaceRole } from '@/utils/format-workspace-role';
import { useForm, usePage } from '@inertiajs/react';
import { CheckIcon, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

type InviteMemberFormData = {
    role: string | null;
    team_id: number | null;
    user_id: number | null;
    message: string;
};

export function InviteMemberDialog() {
    const { user } = usePage<SharedData>().props.auth;
    const [memberDropdownOpen, setMemberDropdownOpen] = useState<boolean>(false);
    const [roleDropdownOpen, setRoleDropdownOpen] = useState<boolean>(false);
    const [teamDropdownOpen, setTeamDropdownOpen] = useState<boolean>(false);

    const { workspaceMembers, roles, invitableTeams, inviteMemberDialogOpen, closeInviteMemberDialog, inviteMemberTeamId } =
        useWorkspaceMembersStore();

    const { data, setData, post, processing, errors, reset } = useForm<InviteMemberFormData>({
        role: null,
        team_id: null,
        user_id: null,
        message: '',
    });

    const showTeamSelector = !inviteMemberTeamId;

    useEffect(() => {
        if (inviteMemberTeamId) {
            setData('team_id', inviteMemberTeamId);
        }
    }, [inviteMemberTeamId]);

    useEffect(() => {
        if (!inviteMemberDialogOpen) {
            reset();
        }
    }, [inviteMemberDialogOpen]);

    const selectedTeamId = data.team_id;

    const filteredMembers = selectedTeamId
        ? workspaceMembers.filter((m) => !m.teams.some((team) => team.id === selectedTeamId) && m.id !== user.id)
        : workspaceMembers.filter((m) => m.id !== user.id);
    const selectedMember = filteredMembers.find((m) => m.id === data.user_id);

    const selectedTeam = invitableTeams.find((t) => t.id === data.team_id);
    const selectedRole = data.role;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.team_id) {
            toast.error('Veuillez sélectionner une équipe');
            return;
        }

        post(invite.url(data.team_id!), {
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
    };

    return (
        <Dialog open={inviteMemberDialogOpen} onOpenChange={closeInviteMemberDialog}>
            <DialogContent className="shadow-dialog flex max-h-[calc(100vh-32px)] flex-col gap-0 overflow-y-visible border-transparent p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
                <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b px-6 py-4 text-base">Inviter un membre</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">Inviter un membre à rejoindre une équipe</DialogDescription>
                <div className="overflow-y-auto">
                    <div className="pt-4">
                        <form className="space-y-4 *:not-last:px-6" onSubmit={submit}>
                            {showTeamSelector && (
                                <div className="*:not-first:mt-2">
                                    <Label htmlFor="team_id">Équipe</Label>
                                    <Popover open={teamDropdownOpen} onOpenChange={setTeamDropdownOpen} modal={true}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={teamDropdownOpen}
                                                className="w-full justify-between"
                                                disabled={processing}
                                            >
                                                {selectedTeam ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="size-3 rounded-full" style={{ backgroundColor: selectedTeam.color }} />
                                                        {selectedTeam.name}
                                                    </div>
                                                ) : (
                                                    'Sélectionnez une équipe'
                                                )}
                                                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full min-w-(--radix-popper-anchor-width) border-input p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Rechercher une équipe..." />
                                                <CommandList>
                                                    <CommandEmpty>Aucune équipe trouvée.</CommandEmpty>
                                                    <CommandGroup>
                                                        {invitableTeams.map((team) => (
                                                            <CommandItem
                                                                key={team.id}
                                                                value={team.name}
                                                                keywords={[team.name, team.identifier]}
                                                                onSelect={() => {
                                                                    setData('team_id', team.id);
                                                                    setData('user_id', null);
                                                                    setTeamDropdownOpen(false);
                                                                }}
                                                                className="flex items-center justify-between"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <span className="size-3 rounded-full" style={{ backgroundColor: team.color }} />
                                                                    {team.name}
                                                                    <span className="text-xs text-muted-foreground">({team.identifier})</span>
                                                                </div>
                                                                {data.team_id === team.id && <CheckIcon size={16} />}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <InputError message={errors.team_id} />
                                </div>
                            )}

                            <div className="grid grid-cols-5 gap-3">
                                <div className="col-span-3 *:not-first:mt-2">
                                    <Label htmlFor="user_id">Membre</Label>
                                    <Popover open={memberDropdownOpen} onOpenChange={setMemberDropdownOpen} modal={true}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={memberDropdownOpen}
                                                className="w-full justify-between"
                                                disabled={processing || (showTeamSelector && !data.team_id)}
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
                                                ) : showTeamSelector && !data.team_id ? (
                                                    "Sélectionnez d'abord une équipe"
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

                                <div className="col-span-2 *:not-first:mt-2">
                                    <Label htmlFor="role_id">Rôle</Label>
                                    <Popover open={roleDropdownOpen} onOpenChange={setRoleDropdownOpen} modal={true}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={roleDropdownOpen}
                                                className="w-full justify-between"
                                                disabled={processing}
                                            >
                                                {selectedRole ? formatWorkspaceRole(selectedRole) : 'Sélectionnez un rôle'}
                                                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full min-w-(--radix-popper-anchor-width) border-input p-0" align="start">
                                            <Command>
                                                <CommandList>
                                                    <CommandGroup>
                                                        {roles.map((role, index) => (
                                                            <CommandItem
                                                                key={index}
                                                                value={role}
                                                                onSelect={() => {
                                                                    setData('role', role);
                                                                    setRoleDropdownOpen(false);
                                                                }}
                                                                className="flex items-center justify-between"
                                                            >
                                                                {formatWorkspaceRole(role)}
                                                                {data.role === role && <CheckIcon size={16} />}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <InputError message={errors.role} />
                                </div>
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
                                <Button type="submit" disabled={processing || !data.team_id}>
                                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                                    Inviter {selectedMember?.name || ''} {selectedTeam ? `dans ${selectedTeam.name}` : "dans l'équipe"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
