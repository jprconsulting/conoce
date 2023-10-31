import { Component } from '@angular/core';
import { LoadingStates } from 'src/app/global/globals';

@Component({
  selector: 'app-respuestas',
  templateUrl: './respuestas.component.html',
  styleUrls: ['./respuestas.component.css']
})
export class RespuestasComponent {
  isLoadingUsers = LoadingStates.neutro;

}
