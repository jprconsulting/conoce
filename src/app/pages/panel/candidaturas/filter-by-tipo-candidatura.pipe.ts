import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByTipoCandidatura'
})
export class FilterByTipoCandidaturaPipe implements PipeTransform {
  transform(items: any[], filtro: string): any[] {
    if (!filtro) {
      return items;
    }

    return items.filter(item => item.nombreCandidatura === filtro);
  }
}
