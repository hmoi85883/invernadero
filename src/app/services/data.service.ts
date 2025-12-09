import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { SensorDefaultsService } from '../services/sensor-defaults.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // Variables públicas
  usuario: string = '';
  rol: string = '';
  invernaderos: any[] = [];
  invernaderoActual: any = null;

  // 👇 TU LINK DE RENDER (Verifica que sea el correcto)
  private baseUrl = 'https://apiinicial.onrender.com';

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private defaults: SensorDefaultsService
  ) { }

  // --- LOGIN ---
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

  // --- DASHBOARD ---
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
    const inputs: any[] = [
      { name: 'nombre', type: 'text', placeholder: 'Nombre' },
      { name: 'ubicacion', type: 'text', placeholder: 'Ubicación' }
    ];

    tipos.forEach((t: any) => {
      inputs.push({ name: 'tipo', type: 'radio', label: t.nombre, value: t.valor, checked: t.valor === 'tradicional' });
    });

    const a = await this.alertCtrl.create({
      header: 'Nuevo Invernadero',
      inputs: inputs,
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Crear', handler: (d: any) => {
            if (!d.nombre) return;
            const nuevo = this.defaults.crearInvernadero(d.nombre, d.tipo);
            nuevo.ubicacion = d.ubicacion || 'Sin definir';
            this.http.post(`${this.baseUrl}/invernaderos`, nuevo).subscribe(() => this.cargarInvernaderos());
          }
        }
      ]
    });
    await a.present();
  }

  // --- DETALLE ---

  // ✅ ESTA ES LA FUNCIÓN QUE TE FALTABA
  cargarUnico(id: any) {
    this.http.get<any>(`${this.baseUrl}/invernaderos/${id}`).subscribe(d => this.invernaderoActual = d);
  }

  async solicitarNuevoSensor() {
    if (!this.invernaderoActual) return;

    const alert = await this.alertCtrl.create({
      header: 'Nuevo Sensor',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre (ej: Co2)' },
        { name: 'valor', type: 'number', placeholder: 'Valor actual' },
        { name: 'min', type: 'number', placeholder: 'Min' },
        { name: 'max', type: 'number', placeholder: 'Max' }
      ],
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Agregar', handler: (d: any) => {
            if (!d.nombre || !d.valor) {
              this.toast('Datos incompletos');
              return false;
            }
            const nuevoSensor = {
              nombre: d.nombre,
              valor: d.valor,
              min: d.min || 0,
              max: d.max || 100
            };
            this.invernaderoActual.sensores.push(nuevoSensor);

            this.http.put(`${this.baseUrl}/invernaderos/${this.invernaderoActual.id}`, this.invernaderoActual)
              .subscribe({
                next: () => this.toast('Sensor agregado'),
                error: () => this.invernaderoActual.sensores.pop()
              });
            return true;
          }
        }
      ]
    });
    await alert.present();
  }
  async editarInvernadero() {
    if (!this.invernaderoActual) return;

    const alert = await this.alertCtrl.create({
      header: 'Editar Invernadero',
      inputs: [
        { 
          name: 'nombre', 
          type: 'text', 
          value: this.invernaderoActual.nombre, 
          placeholder: 'Nombre' 
        },
        { 
          name: 'ubicacion', 
          type: 'text', 
          value: this.invernaderoActual.ubicacion, 
          placeholder: 'Ubicación' 
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Guardar', 
          handler: (d) => {
            // Actualizamos el objeto local
            this.invernaderoActual.nombre = d.nombre;
            this.invernaderoActual.ubicacion = d.ubicacion;

            // Guardamos en la API
            this.http.put(`${this.baseUrl}/invernaderos/${this.invernaderoActual.id}`, this.invernaderoActual)
              .subscribe({
                next: () => this.toast('Información actualizada'),
                error: () => this.toast('Error al actualizar')
              });
          }
        }
      ]
    });
    await alert.present();
  }

  async editarSensor(sensor: any) {
    const a = await this.alertCtrl.create({
      header: 'Editar ' + sensor.nombre,
      inputs: [
        { name: 'val', value: sensor.valor, placeholder: 'Valor', type: 'number' },
        { name: 'min', value: sensor.min, placeholder: 'Min', type: 'number' },
        { name: 'max', value: sensor.max, placeholder: 'Max', type: 'number' }
      ],
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Guardar', handler: (d: any) => {
            sensor.valor = d.val;
            sensor.min = d.min;
            sensor.max = d.max;

            this.http.put(`${this.baseUrl}/invernaderos/${this.invernaderoActual.id}`, this.invernaderoActual).subscribe(() => {
              this.toast('Actualizado');
            });
          }
        }
      ]
    });
    await a.present();
  }

  // --- HELPERS ---
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
  // --- EDICIÓN DE PERFIL ---
  async editarPerfil() {
    const alert = await this.alertCtrl.create({
      header: 'Editar Perfil',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          value: this.usuario, // Pre-llenamos con el dato actual
          placeholder: 'Tu Nombre'
        },
        {
          name: 'rol',
          type: 'text',
          value: this.rol,
          placeholder: 'Cargo (ej: Supervisor)'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (d) => {
            if (!d.nombre || !d.rol) {
              this.toast('Los campos no pueden estar vacíos');
              return false;
            }
            // Actualizamos las variables locales
            this.usuario = d.nombre;
            this.rol = d.rol;

            // Opcional: Aquí podrías hacer una petición PUT a tu API para guardar cambios reales
            // this.http.put(...)

            this.toast('Perfil actualizado');
            return true;
          }
        }
      ]
    });
    await alert.present();
  }
}