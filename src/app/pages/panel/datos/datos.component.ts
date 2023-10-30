import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatosService } from 'src/app/core/services/datos.service';
import { Consentimiento } from 'src/app/models/consentimientos';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css']
})
export class DatosComponent {
  Consentimiento: any; // Aquí deberías definir el tipo correcto para Consentimiento

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Aquí puedes asignar valores a Consentimiento
    const id = this.route.snapshot.paramMap.get('id');
    // Luego, usa id para obtener los datos de Consentimiento
    this.Consentimiento = this.Consentimiento(id);
  }
}
