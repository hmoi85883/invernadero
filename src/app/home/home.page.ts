import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon, IonFab, IonFabButton, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, personCircle } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon, IonFab, IonFabButton, IonButtons]
})
export class HomePage {
  intervalo: any;
  constructor(public data: DataService, private router: Router) { 
    addIcons({ add, trash, personCircle }); 
  }

  ionViewDidEnter() {
    this.data.cargarInvernaderos();
    this.intervalo = setInterval(() => this.data.cargarInvernaderos(), 5000);
  }
  ionViewWillLeave() { clearInterval(this.intervalo); }
  irDetalle(id: any) { this.router.navigate(['/detalle', id]); }
}