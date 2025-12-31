<?php

namespace App\Http\Middleware;

use App\Modules\Workspace\Enums\WorkspaceRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class WorkspaceAccess
{
    /**
     * Handle an incoming request.
     *
     * Vérifie que l'utilisateur a accès au workspace :
     * - Est un workspace-admin (rôle Spatie)
     * - OU est membre d'au moins une équipe (via pivot)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(403, 'Accès non autorisé.');
        }

        // Vérifie si l'utilisateur est admin ou membre d'une équipe
        $hasAccess = $user->hasRole(WorkspaceRole::adminRole()) || $user->teams()->exists();

        if (! $hasAccess) {
            abort(403, 'Vous n\'avez pas accès au workspace.');
        }

        return $next($request);
    }
}
