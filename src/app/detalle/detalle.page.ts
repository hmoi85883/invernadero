import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
  IonSegment, IonSegmentButton, IonLabel, IonContent, IonIcon,
  IonRippleEffect, IonButton // <--- AGREGADO AQUÍ
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  createOutline, thermometer, water, sunny, hardwareChip, 
  arrowBackOutline, chevronForward, barChartOutline, add 
} from 'ionicons/icons';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
    IonSegment, IonSegmentButton, IonLabel, IonContent, IonIcon,
    IonRippleEffect, IonButton // <--- AGREGADO AQUÍ TAMBIÉN
  ]
})
export class DetallePage {
  seccion = 'monitor';
  intervalo: any;

  constructor(private route: ActivatedRoute, public data: DataService) {
    // Registramos los iconos con sus nombres exactos usados en el HTML
    addIcons({ 
      'create-outline': createOutline, 
      'arrow-back-outline': arrowBackOutline, 
      'bar-chart-outline': barChartOutline,
      thermometer, water, sunny, 'hardware-chip': hardwareChip,
      'chevron-forward': chevronForward,
      add
    });
  }

  ionViewDidEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    this.cargar(id);
    this.intervalo = setInterval(() => this.cargar(id), 5000);
  }
  
  ionViewWillLeave() { clearInterval(this.intervalo); }
  
  cargar(id: any) { if(id) this.data.cargarUnico(id); }
}