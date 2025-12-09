import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonCard, 
  IonButton, IonIcon, IonFab, IonFabButton, IonButtons, 
  IonRippleEffect, IonBadge, ActionSheetController // <--- 1. IMPORTANTE: ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  add, trash, person, locationOutline, trashOutline,
  thermometer, water, sunny, hardwareChip,
  notifications // <--- 2. IMPORTANTE: Icono de campana
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

  constructor(
    public data: DataService, 
    private router: Router,
    private actionSheetCtrl: ActionSheetController // <--- 3. Inyectamos el controlador
  ) { 
    // Registramos los iconos
    addIcons({ 
      add, trash, person, 'location-outline': locationOutline, 'trash-outline': trashOutline,
      thermometer, water, sunny, 'hardware-chip': hardwareChip,
      notifications // <--- Registrado
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

  // 👇 4. FUNCIÓN NUEVA: Mostrar el menú de alertas
  async verNotificaciones() {
    // Creamos botones para cada alerta
    const botones = this.data.notificaciones.map(n => ({
      text: `${n.titulo} - ${n.msg}`,
      icon: n.color === 'danger' ? 'thermometer' : 'snow',
      role: 'destructive',
      handler: () => {
        console.log('Alerta revisada');
      }
    }));

    // Botón de cerrar (siempre debe estar)
    botones.push({ 
      text: 'Cerrar', 
      icon: 'close', 
      role: 'cancel', 
      handler: () => {} 
    });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Centro de Alertas',
      subHeader: this.data.notificaciones.length > 0 
        ? `Tienes ${this.data.notificaciones.length} alertas activas` 
        : 'Todo funciona correctamente ✅',
      buttons: botones,
      cssClass: 'my-custom-class'
    });
    await actionSheet.present();
  }
}