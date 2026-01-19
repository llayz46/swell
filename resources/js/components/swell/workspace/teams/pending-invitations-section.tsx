import { accept } from '@/actions/App/Modules/Workspace/Http/Controllers/TeamInvitationController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TeamInvitation } from '@/types/workspace';
import { formatWorkspaceRole } from '@/utils/format-workspace-role';
import { router } from '@inertiajs/react';
import { Check, Clock, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function PendingInvitationsSection({ invitations }: { invitations: TeamInvitation[] }) {
    const [loadingInvitationId, setLoadingInvitationId] = useState<number | null>(null);

    const handleJoin = (invitationId: number) => {
        setLoadingInvitationId(invitationId);

        router.post(
            accept.url(invitationId),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Vous avez rejoint l'équipe avec succès.");
                },
                onError: () => {
                    toast.error("Une erreur est survenue lors de l'acceptation de l'invitation.");
                },
                onFinish: () => {
                    setLoadingInvitationId(null);
                },
            },
        );
    };

    const handleDecline = (invitationId: number) => {
        router.post(
            `/workspace/team-invitations/${invitationId}/decline`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="m-2 rounded-lg border border-[color-mix(in_oklab,var(--color-blue-500)_32%,transparent)] bg-[color-mix(in_oklab,var(--color-blue-500)_4%,transparent)] p-4">
            <div className="mb-2 flex items-center gap-2">
                <Clock className="size-4 text-blue-500" />
                <h2 className="text-sm font-semibold">Invitations en attente</h2>
                <Badge>{invitations.length}</Badge>
            </div>

            <div className="space-y-2">
                {invitations.map((invitation) => (
                    <div
                        key={invitation.id}
                        className="flex items-center justify-between rounded-md border bg-[color-mix(in_oklab,var(--input)_32%,transparent)] p-2"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="flex size-10 shrink-0 items-center justify-center rounded"
                                style={{ backgroundColor: invitation.team.color }}
                            >
                                <span>{invitation.team.icon}</span>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{invitation.team.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                        {formatWorkspaceRole(invitation.role)}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Invité par {invitation.inviter.name}</p>
                                {invitation.message && <p className="mt-1 text-xs text-muted-foreground italic">"{invitation.message}"</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleJoin(invitation.id)}
                                disabled={loadingInvitationId === invitation.id}
                                className="cursor-pointer gap-1 border-[color-mix(in_oklab,#00bc7d_32%,transparent)] bg-[color-mix(in_oklab,var(--color-emerald-500)_4%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-emerald-500)_8%,transparent)]"
                            >
                                <Check className="size-3" />
                                Accepter
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDecline(invitation.id)}
                                disabled={loadingInvitationId === invitation.id}
                                className="cursor-pointer gap-1 border-[color-mix(in_oklab,var(--destructive)_32%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_4%,transparent)] hover:bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)]"
                            >
                                <X className="size-3" />
                                Refuser
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
