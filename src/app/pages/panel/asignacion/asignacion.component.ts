import { Component, OnInit } from '@angular/core';
import { CandidatoService } from 'src/app/core/services/candidato.service';
@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.css']
})
export class AsignacionComponent implements OnInit {
  candidatos: any[] = []; // Aquí almacenaremos los datos de los candidatos
  constructor(private candidatoService: CandidatoService) {
  }
  ngOnInit() {
    // Llamar al servicio para obtener los datos de los candidatos
    this.candidatoService.getCandidatos().subscribe((data: any) => {
      this.candidatos = data;
    });
  }
}
