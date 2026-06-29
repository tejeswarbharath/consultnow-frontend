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
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => {
      const expertService = inject(ExpertService);
      return firstValueFrom(
        expertService.getExperts().pipe(
          map(experts => experts.map(expert => ({ id: expert.id })))
        )
      );
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
