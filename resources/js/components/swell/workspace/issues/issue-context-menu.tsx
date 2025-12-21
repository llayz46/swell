import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
   ContextMenuContent,
   ContextMenuGroup,
   ContextMenuItem,
   ContextMenuSeparator,
   ContextMenuShortcut,
   ContextMenuSub,
   ContextMenuSubContent,
   ContextMenuSubTrigger,
} from '@/components/ui/context-menu';
import {
   CircleCheck,
   User,
   BarChart3,
   Tag,
   Folder,
   CalendarClock,
   Pencil,
   Link as LinkIcon,
   Repeat2,
   Copy as CopyIcon,
   PlusSquare,
   Flag,
   ArrowRightLeft,
   Bell,
   Star,
   AlarmClock,
   Trash2,
   CheckCircle2,
   Clock,
   FileText,
   MessageSquare,
   Clipboard,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface IssueContextMenuProps {
   issueId?: string;
}

export function IssueContextMenu({ issueId }: IssueContextMenuProps) {
   const [isSubscribed, setIsSubscribed] = useState(false);
   const [isFavorite, setIsFavorite] = useState(false);

   // const handleStatusChange = (statusId: string) => {
   //    if (!issueId) return;
   //    const newStatus = status.find((s) => s.id === statusId);
   //    if (newStatus) {
   //       updateIssueStatus(issueId, newStatus);
   //       toast.success(`Status updated to ${newStatus.name}`);
   //    }
   // };

   // const handlePriorityChange = (priorityId: string) => {
   //    if (!issueId) return;
   //    const newPriority = priorities.find((p) => p.id === priorityId);
   //    if (newPriority) {
   //       updateIssuePriority(issueId, newPriority);
   //       toast.success(`Priority updated to ${newPriority.name}`);
   //    }
   // };

   // const handleAssigneeChange = (userId: string | null) => {
   //    if (!issueId) return;
   //    const newAssignee = userId ? users.find((u) => u.id === userId) || null : null;
   //    updateIssueAssignee(issueId, newAssignee);
   //    toast.success(newAssignee ? `Assigned to ${newAssignee.name}` : 'Unassigned');
   // };

   // const handleLabelToggle = (labelId: string) => {
   //    if (!issueId) return;
   //    const issue = getIssueById(issueId);
   //    const label = labels.find((l) => l.id === labelId);

   //    if (!issue || !label) return;

   //    const hasLabel = issue.labels.some((l) => l.id === labelId);

   //    if (hasLabel) {
   //       removeIssueLabel(issueId, labelId);
   //       toast.success(`Removed label: ${label.name}`);
   //    } else {
   //       addIssueLabel(issueId, label);
   //       toast.success(`Added label: ${label.name}`);
   //    }
   // };

   // const handleProjectChange = (projectId: string | null) => {
   //    if (!issueId) return;
   //    const newProject = projectId ? projects.find((p) => p.id === projectId) : undefined;
   //    updateIssueProject(issueId, newProject);
   //    toast.success(newProject ? `Project set to ${newProject.name}` : 'Project removed');
   // };

   // const handleSetDueDate = () => {
   //    if (!issueId) return;
   //    const dueDate = new Date();
   //    dueDate.setDate(dueDate.getDate() + 7);
   //    updateIssue(issueId, { dueDate: dueDate.toISOString() });
   //    toast.success('Due date set to 7 days from now');
   // };

   // const handleAddLink = () => {
   //    toast.success('Link added');
   // };

   // const handleMakeCopy = () => {
   //    toast.success('Issue copied');
   // };

   // const handleCreateRelated = () => {
   //    toast.success('Related issue created');
   // };

   // const handleMarkAs = (type: string) => {
   //    toast.success(`Marked as ${type}`);
   // };

   // const handleMove = () => {
   //    toast.success('Issue moved');
   // };

   // const handleSubscribe = () => {
   //    setIsSubscribed(!isSubscribed);
   //    toast.success(isSubscribed ? 'Unsubscribed from issue' : 'Subscribed to issue');
   // };

   // const handleFavorite = () => {
   //    setIsFavorite(!isFavorite);
   //    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
   // };

   // const handleCopy = () => {
   //    if (!issueId) return;
   //    const issue = getIssueById(issueId);
   //    if (issue) {
   //       navigator.clipboard.writeText(issue.title);
   //       toast.success('Copied to clipboard');
   //    }
   // };

   // const handleRemindMe = () => {
   //    toast.success('Reminder set');
   // };

   return (
      <ContextMenuContent className="w-64 bg-sidebar">
         <ContextMenuGroup>
            <ContextMenuSub>
               <ContextMenuSubTrigger>
                  <CircleCheck className="mr-2 size-4" /> Statuts
               </ContextMenuSubTrigger>
               <ContextMenuSubContent className="w-48">
                  {/*{status.map((s) => {
                     const Icon = s.icon;
                     return (
                        <ContextMenuItem key={s.id} onClick={() => handleStatusChange(s.id)}>
                           <Icon /> {s.name}
                        </ContextMenuItem>
                     );
                  })}*/}
               </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuSub>
               <ContextMenuSubTrigger>
                  <User className="mr-2 size-4" /> Attribution
               </ContextMenuSubTrigger>
               <ContextMenuSubContent className="w-48">
                  {/*<ContextMenuItem onClick={() => handleAssigneeChange(null)}>*/}
                  <ContextMenuItem>
                     <User className="mr-2 size-4" /> Non attribué
                  </ContextMenuItem>
                  {/*{users
                     .filter((user) => user.teamIds.includes('CORE'))
                     .map((user) => (
                        <ContextMenuItem
                           key={user.id}
                           onClick={() => handleAssigneeChange(user.id)}
                        >
                           <Avatar className="size-4">
                              <AvatarImage src={user.avatarUrl} alt={user.name} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                           </Avatar>
                           {user.name}
                        </ContextMenuItem>
                     ))}*/}
               </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuSub>
               <ContextMenuSubTrigger>
                  <BarChart3 className="mr-2 size-4" /> Priorité
               </ContextMenuSubTrigger>
               <ContextMenuSubContent className="w-48">
                  {/*{priorities.map((priority) => (
                     <ContextMenuItem
                        key={priority.id}
                        onClick={() => handlePriorityChange(priority.id)}
                     >
                        <priority.icon className="size-4" /> {priority.name}
                     </ContextMenuItem>
                  ))}*/}
               </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuSub>
               <ContextMenuSubTrigger>
                   <Tag className="mr-2 size-4" /> Étiquettes
               </ContextMenuSubTrigger>
               <ContextMenuSubContent className="w-48">
                  {/*{labels.map((label) => (
                     <ContextMenuItem key={label.id} onClick={() => handleLabelToggle(label.id)}>
                        <span
                           className="inline-block size-3 rounded-full"
                           style={{ backgroundColor: label.color }}
                           aria-hidden="true"
                        />
                        {label.name}
                     </ContextMenuItem>
                  ))}*/}
               </ContextMenuSubContent>
            </ContextMenuSub>

            {/*<ContextMenuItem onClick={handleSetDueDate}>*/}
            <ContextMenuItem>
                <CalendarClock className="mr-2 size-4" /> Définir la date d'échéance...
               <ContextMenuShortcut>D</ContextMenuShortcut>
            </ContextMenuItem>

            <ContextMenuItem>
               <Pencil className="mr-2 size-4" /> Renommer...
               <ContextMenuShortcut>R</ContextMenuShortcut>
            </ContextMenuItem>

            <ContextMenuSeparator />

            {/*<ContextMenuItem onClick={handleAddLink}>*/}
            <ContextMenuItem>
               <LinkIcon className="mr-2 size-4" /> Ajouter un lien...
               <ContextMenuShortcut>Ctrl L</ContextMenuShortcut>
            </ContextMenuItem>

            <ContextMenuSub>
               <ContextMenuSubTrigger>
                  <Repeat2 className="mr-2 size-4" /> Convertir en
               </ContextMenuSubTrigger>
               <ContextMenuSubContent className="w-48">
                  <ContextMenuItem>
                     <FileText className="mr-2 size-4" /> Document
                  </ContextMenuItem>
                  <ContextMenuItem>
                     <MessageSquare className="mr-2 size-4" /> Commentaire
                  </ContextMenuItem>
               </ContextMenuSubContent>
            </ContextMenuSub>

            {/*<ContextMenuItem onClick={handleMakeCopy}>*/}
            <ContextMenuItem>
               <CopyIcon className="mr-2 size-4" /> Faire une copie...
            </ContextMenuItem>
         </ContextMenuGroup>

         <ContextMenuSeparator />

         {/*<ContextMenuItem onClick={handleCreateRelated}>*/}
         <ContextMenuItem>
            <PlusSquare className="mr-2 size-4" /> Create related
         </ContextMenuItem>

         <ContextMenuSub>
            <ContextMenuSubTrigger>
               <Flag className="mr-2 size-4" /> Marquer comme
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
               {/*<ContextMenuItem onClick={() => handleMarkAs('Completed')}>*/}
               <ContextMenuItem>
                  <CheckCircle2 className="mr-2 size-4" /> Terminé
               </ContextMenuItem>
               {/*<ContextMenuItem onClick={() => handleMarkAs('Duplicate')}>*/}
               <ContextMenuItem>
                  <CopyIcon className="mr-2 size-4" /> Dupliquer
               </ContextMenuItem>
               {/*<ContextMenuItem onClick={() => handleMarkAs("Won't Fix")}>*/}
               <ContextMenuItem>
                  <Clock className="mr-2 size-4" /> Non résolu
               </ContextMenuItem>
            </ContextMenuSubContent>
         </ContextMenuSub>

         {/*<ContextMenuItem onClick={handleMove}>*/}
         <ContextMenuItem>
            <ArrowRightLeft className="mr-2 size-4" /> Déplacer
         </ContextMenuItem>

         <ContextMenuSeparator />

         {/*<ContextMenuItem onClick={handleSubscribe}>*/}
         <ContextMenuItem>
             <Bell className="mr-2 size-4" /> {isSubscribed ? "Se désabonner" : "S'abonner"}
            <ContextMenuShortcut>S</ContextMenuShortcut>
         </ContextMenuItem>

         {/*<ContextMenuItem onClick={handleFavorite}>*/}
         <ContextMenuItem>
            <Star className="mr-2 size-4" /> {isFavorite ? 'Retirer des favoris' : 'Favoris'}
            <ContextMenuShortcut>F</ContextMenuShortcut>
         </ContextMenuItem>

         {/*<ContextMenuItem onClick={handleCopy}>*/}
         <ContextMenuItem>
            <Clipboard className="mr-2 size-4" /> Copier
         </ContextMenuItem>

         {/*<ContextMenuItem onClick={handleRemindMe}>*/}
         <ContextMenuItem>
            <AlarmClock className="mr-2 size-4" /> Rappeler
            <ContextMenuShortcut>H</ContextMenuShortcut>
         </ContextMenuItem>

         <ContextMenuSeparator />

         <ContextMenuItem className="hover:bg-destructive/15! text-destructive hover:text-destructive! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40">
            <Trash2 className="mr-2 size-4 text-destructive" /> Supprimer
            <ContextMenuShortcut className="text-destructive">⌘⌫</ContextMenuShortcut>
         </ContextMenuItem>
      </ContextMenuContent>
   );
}