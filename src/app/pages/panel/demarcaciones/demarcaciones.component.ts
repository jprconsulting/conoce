import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-demarcaciones',
  templateUrl: './demarcaciones.component.html',
  styleUrls: ['./demarcaciones.component.css']
})
export class DemarcacionesComponent {
  selectedPeople: any[] = [];
  selectedEstado: string = '';
  selectedDistrito: string = '';
  selectedAyuntamiento: string = '';
  selectedComunidad: string = '';
  distritosPorEstado: { [key: string]: string[] } = {
    Hidalgo: ['Distrito 1 | Pachuca de Soto', 'Distrito 2 | Tulancingo de Bravo', 'Distrito 3 | Tula de Allende', 'Distrito 4 | Ixmiquilpan'],
    Puebla: ['Distrito 5', 'Distrito 6', 'Distrito 7', 'Distrito 8'],
    Tlaxcala: ['Distrito 9', 'Distrito 10', 'Distrito 11', 'Distrito 12'],
    Veracruz: ['Distrito 13', 'Distrito 14', 'Distrito 15', 'Distrito 16']
  };
  ayuntamientosPorDistrito: { [key: string]: string[] } = {
    'Distrito 1 | Pachuca de Soto': ['Ayuntamiento de Pachuca de Soto', 'Ayuntamiento de Tulancingo de Bravo', 'Ayuntamiento de Tula de Allende', 'Ayuntamiento de Ixmiquilpan'],
    'Distrito 2 | Tulancingo de Bravo': ['Ayuntamiento E', 'Ayuntamiento F', 'Ayuntamiento G', 'Ayuntamiento H'],
    'Distrito 3 | Tula de Allende': ['Ayuntamiento I', 'Ayuntamiento J', 'Ayuntamiento K', 'Ayuntamiento L'],
    'Distrito 4 | Ixmiquilpan': ['Ayuntamiento M', 'Ayuntamiento N', 'Ayuntamiento O', 'Ayuntamiento P'],
    'Distrito 5': ['Ayuntamiento Q', 'Ayuntamiento R', 'Ayuntamiento S', 'Ayuntamiento T'],
    'Distrito 6': ['Ayuntamiento U', 'Ayuntamiento V', 'Ayuntamiento W', 'Ayuntamiento X'],
    'Distrito 7': ['Ayuntamiento Y', 'Ayuntamiento Z', 'Ayuntamiento AA', 'Ayuntamiento BB'],
    'Distrito 8': ['Ayuntamiento CC', 'Ayuntamiento DD', 'Ayuntamiento EE', 'Ayuntamiento FF'],
    'Distrito 9': ['Ayuntamiento GG', 'Ayuntamiento HH', 'Ayuntamiento II', 'Ayuntamiento JJ'],
    'Distrito 10': ['Ayuntamiento KK', 'Ayuntamiento LL', 'Ayuntamiento MM', 'Ayuntamiento NN'],
    'Distrito 11': ['Ayuntamiento OO', 'Ayuntamiento PP', 'Ayuntamiento QQ', 'Ayuntamiento RR'],
    'Distrito 12': ['Ayuntamiento SS', 'Ayuntamiento TT', 'Ayuntamiento UU', 'Ayuntamiento VV'],
    'Distrito 13': ['Ayuntamiento WW', 'Ayuntamiento XX', 'Ayuntamiento YY', 'Ayuntamiento ZZ'],
    'Distrito 14': ['Ayuntamiento AAA', 'Ayuntamiento BBB', 'Ayuntamiento CCC', 'Ayuntamiento DDD'],
    'Distrito 15': ['Ayuntamiento EEE', 'Ayuntamiento FFF', 'Ayuntamiento GGG', 'Ayuntamiento HHH'],
    'Distrito 16': ['Ayuntamiento III', 'Ayuntamiento JJJ', 'Ayuntamiento KKK', 'Ayuntamiento LLL']
  };
  comunidadesPorAyuntamiento: { [key: string]: string[] } = {
    'Ayuntamiento de Pachuca de Soto': ['Comunidad 1', 'Comunidad 2', 'Comunidad 3', 'Comunidad 4'],
    'Ayuntamiento de Tulancingo de Bravo': ['Comunidad 5', 'Comunidad 6', 'Comunidad 7', 'Comunidad 8'],
    'Ayuntamiento de Tula de Allende': ['Comunidad 9', 'Comunidad 10', 'Comunidad 11', 'Comunidad 12'],
    'Ayuntamiento de Ixmiquilpan': ['Comunidad 13', 'Comunidad 14', 'Comunidad 15', 'Comunidad 16'],
    'Ayuntamiento E': ['Comunidad 17', 'Comunidad 18', 'Comunidad 19', 'Comunidad 20'],
    'Ayuntamiento F': ['Comunidad 21', 'Comunidad 22', 'Comunidad 23', 'Comunidad 24'],
    'Ayuntamiento G': ['Comunidad 25', 'Comunidad 26', 'Comunidad 27', 'Comunidad 28'],
    'Ayuntamiento H': ['Comunidad 29', 'Comunidad 30', 'Comunidad 31', 'Comunidad 32'],
  };
  @ViewChild('userForm') userForm!: NgForm; // Referencia al formulario

  submitForm() {
    // Aquí puedes manejar la lógica de envío del formulario
    console.log('Estado:', this.selectedEstado);
    console.log('Distrito:', this.selectedDistrito);
    console.log('Ayuntamiento:', this.selectedAyuntamiento);
    console.log('Comunidad:', this.selectedComunidad); 
  }

  resetForm() {
    this.selectedEstado = '';
    this.selectedDistrito = '';
    this.selectedAyuntamiento = '';
    this.selectedComunidad = '';
    this.userForm.resetForm(); 
  }
}