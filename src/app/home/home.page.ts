import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonCard, 
  IonButton, IonIcon, IonFab, IonFabButton, IonButtons, 
  IonRippleEffect, IonBadge 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
// 👇 IMPORTAMOS LOS ICONOS DE SENSORES QUE FALTABAN
import { 
  add, trash, person, locationOutline, trashOutline,
  thermometer, water, sunny, hardwareChip 
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonCard, 
    IonButton, IonIcon, IonFab, IonFabButton, IonButtons,
    IonRippleEffect, IonBadge
  ]
})
export class HomePage {
  intervalo: any;

  constructor(public data: DataService, private router: Router) { 
    // 👇 REGISTRAMOS TODOS LOS ICONOS AQUÍ
    addIcons({ 
      add, trash, person, 'location-outline': locationOutline, 'trash-outline': trashOutline,
      thermometer, water, sunny, 'hardware-chip': hardwareChip
    }); 
  }

  ionViewDidEnter() {
    this.data.cargarInvernaderos();
    this.intervalo = setInterval(() => this.data.cargarInvernaderos(), 5000);
  }
  
  ionViewWillLeave() { clearInterval(this.intervalo); }

  irDetalle(id: any) { this.router.navigate(['/detalle', id]); }
  
  agregar() { this.data.solicitarNuevo(); }

  borrar(event: Event, id: any) {
    event.stopPropagation();
    this.data.borrarInvernadero(id);
  }
}