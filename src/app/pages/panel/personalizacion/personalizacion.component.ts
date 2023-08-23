import { Component } from '@angular/core';
import { Diseño } from 'src/app/models/diseño';
import { PersonalizacionService } from 'src/app/core/services/personalizacion.service';

@Component({
  selector: 'app-personalizacion',
  templateUrl: './personalizacion.component.html',
  styleUrls: ['./personalizacion.component.css']
})
export class PersonalizacionComponent {

  diseño: Diseño[] = [];

  constructor(
    private PersonalizacionService: PersonalizacionService,
  ) {

}
}
