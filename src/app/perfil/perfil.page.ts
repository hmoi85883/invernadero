import { Component } from '@angular/core';
// 👇 1. IMPORTANTE: Agregar FormsModule
import { FormsModule } from '@angular/forms'; 
import { DataService } from '../services/data.service';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
  IonContent, IonItem, IonLabel, IonButton, IonIcon, 
  IonAvatar, IonBadge, IonList, IonNote, IonToggle 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  person, personOutline, shieldCheckmarkOutline, 
  mailOutline, logOutOutline, arrowBackOutline, 
  notificationsOutline, createOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    FormsModule, // <--- 👇 2. AGREGADO AQUÍ PARA QUE FUNCIONE EL TOGGLE
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
    IonContent, IonItem, IonLabel, IonButton, IonIcon,
    IonAvatar, IonBadge, IonList, IonNote, IonToggle
  ]
})
export class PerfilPage {
  constructor(public data: DataService) { 
    addIcons({ 
      person, 
      'person-outline': personOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'mail-outline': mailOutline,
      'log-out-outline': logOutOutline,
      'arrow-back-outline': arrowBackOutline,
      'notifications-outline': notificationsOutline,
      'create-outline': createOutline
    });
  }
}