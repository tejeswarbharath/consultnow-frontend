import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { firstValueFrom, map } from 'rxjs';
import { ExpertService } from './services/expert.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'chat/:expertId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'booking/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
