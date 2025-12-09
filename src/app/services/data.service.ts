import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { SensorDefaultsService } from '../services/sensor-defaults.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  // Variables que usan tus páginas
  usuario: string = '';
  rol: string = '';
  invernaderos: any[] = [];
  invernaderoActual: any = null;

  // 👇 TU LINK DE RENDER AQUÍ
  private baseUrl = 'https://apiinicial.onrender.com'; 

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private defaults: SensorDefaultsService
  ) { }

  // LOGIN
  iniciarSesion(user: string, pass: string) {
    if (!user || !pass) { this.toast('Faltan datos'); return; }
    
    this.http.get<any[]>(`${this.baseUrl}/usuarios`).subscribe({
      next: (usuarios) => {
        const u = usuarios.find(x => x.usuario === user && x.password === pass);
        if (u) {
          this.usuario = u.nombre;
          this.rol = u.rol;
          this.router.navigateByUrl('/home');
        } else {
          this.alerta('Error', 'Credenciales incorrectas');
        }
      },
      error: () => this.alerta('Error', 'Fallo de conexión')
    });
  }

  cerrarSesion() {
    this.usuario = '';
    this.invernaderos = [];
    this.router.navigateByUrl('/login');
  }

  // DASHBOARD
  cargarInvernaderos() {
    this.http.get<any[]>(`${this.baseUrl}/invernaderos`).subscribe(d => this.invernaderos = d);
  }

  borrarInvernadero(id: any) {
    this.http.delete(`${this.baseUrl}/invernaderos/${id}`).subscribe(() => {
      this.cargarInvernaderos();
      this.toast('Eliminado');
    });
  }

  async solicitarNuevo() {
    const tipos = this.defaults.getNombresTipos();
    const inputs: any[] = [{ name: 'nombre', placeholder: 'Nombre' }];
    tipos.forEach(t => inputs.push({ name: 'tipo', type: 'radio', label: t.nombre, value: t.valor, checked: t.valor === 'tradicional' }));

    const a = await this.alertCtrl.create({
      header: 'Nuevo Invernadero',
      inputs: inputs,
      buttons: [
        { text: 'Cancelar' },
        { text: 'Crear', handler: (d) => {
            if(!d.nombre) return;
            const nuevo = this.defaults.crearInvernadero(d.nombre, d.tipo);
            this.http.post(`${this.baseUrl}/invernaderos`, nuevo).subscribe(() => this.cargarInvernaderos());
        }}
      ]
    });
    await a.present();
  }

  // DETALLE
  cargarUnico(id: any) {
    this.http.get<any>(`${this.baseUrl}/invernaderos/${id}`).subscribe(d => this.invernaderoActual = d);
  }

  async editarSensor(sensor: any) {
    const a = await this.alertCtrl.create({
      header: 'Editar ' + sensor.nombre,
      inputs: [{ name: 'val', value: sensor.valor, placeholder: 'Nuevo Valor' }],
      buttons: [{ text: 'Guardar', handler: (d) => {
        sensor.valor = d.val;
        this.http.put(`${this.baseUrl}/invernaderos/${this.invernaderoActual.id}`, this.invernaderoActual).subscribe();
      }}]
    });
    await a.present();
  }

  // HELPERS
  analizarSensor(nombre: string, valorStr: string) {
    let icono = 'hardware-chip';
    let color = 'medium';
    const txt = (nombre || '').toLowerCase();
    const val = parseFloat(valorStr);

    if (txt.includes('temp')) { icono = 'thermometer'; color = val > 35 ? 'danger' : 'success'; }
    else if (txt.includes('hum')) { icono = 'water'; color = 'primary'; }
    else if (txt.includes('luz')) { icono = 'sunny'; color = 'warning'; }

    return { icono, color };
  }

  async toast(msg: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, position: 'bottom' });
    await t.present();
  }
  async alerta(h: string, m: string) {
    const a = await this.alertCtrl.create({ header: h, message: m, buttons: ['OK'] });
    await a.present();
  }
}