import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonCard, 
  IonButton, IonIcon, IonFab, IonFabButton, IonButtons, 
  IonRippleEffect, IonBadge // <--- AGREGADOS
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, person, locationOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonCard, 
    IonButton, IonIcon, IonFab, IonFabButton, IonButtons,
    IonRippleEffect, IonBadge // <--- AGREGADOS AQUÍ TAMBIÉN
  ]
})
export class HomePage {
  intervalo: any;

  constructor(public data: DataService, private router: Router) { 
    // Agregamos los iconos nuevos del diseño
    addIcons({ add, trash, person, 'location-outline': locationOutline, 'trash-outline': trashOutline }); 
  }

  ionViewDidEnter() {
    this.data.cargarInvernaderos();
    this.intervalo = setInterval(() => this.data.cargarInvernaderos(), 5000);
  }
  
  ionViewWillLeave() { clearInterval(this.intervalo); }

  irDetalle(id: any) { this.router.navigate(['/detalle', id]); }

  // --- FUNCIONES QUE FALTABAN (Puentes al servicio) ---
  
  agregar() {
    this.data.solicitarNuevo();
  }

  borrar(event: Event, id: any) {
    event.stopPropagation(); // Evita entrar al detalle al hacer click en borrar
    this.data.borrarInvernadero(id);
  }
}