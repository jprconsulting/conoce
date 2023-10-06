import { Pipe, PipeTransform } from '@angular/core';
import { Partidos } from 'src/app/models/partidos'; // Ajusta la importación a la ubicación correcta de tu modelo de datos

@Pipe({
  name: 'filterByTipoCandidatura'
})
export class FilterByTipoCandidaturaPipe implements PipeTransform {
  transform(items: Partidos[], filtro: string): Partidos[] {
    if (!filtro) return items; // Si el filtro está vacío, retorna todos los elementos.

    // Filtra los elementos que coinciden con el tipo de candidatura especificado.
    return items.filter(item => item.nombreCandidatura.toLowerCase().includes(filtro.toLowerCase()));
  }
}
