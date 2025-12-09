import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
  IonContent, IonItem, IonLabel, IonButton, IonIcon, 
  IonAvatar, IonBadge, IonList, IonNote, IonToggle // <--- Componentes nuevos
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  person, personOutline, shieldCheckmarkOutline, 
  mailOutline, logOutOutline, arrowBackOutline, 
  notificationsOutline // <--- Iconos nuevos
} from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
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
      'notifications-outline': notificationsOutline
    });
  }
}