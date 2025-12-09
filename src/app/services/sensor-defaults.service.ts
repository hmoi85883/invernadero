import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SensorDefaultsService {

  private configuraciones: any = {
    tradicional: {
      nombre: 'Tradicional (Manual)',
      sensores: [
        { nombre: 'Temp. Ambiente', valor: '28', min: 18, max: 35 },
        { nombre: 'Humedad', valor: '50%', min: 40, max: 70 }
      ],
      tieneCamara: false
    },
    avanzado: {
      nombre: 'Avanzado (Hidropónico)',
      sensores: [
        { nombre: 'Temp. Ambiente', valor: '24', min: 20, max: 30 },
        { nombre: 'pH Agua', valor: '6.0', min: 5.5, max: 6.5 },
        { nombre: 'EC Nutrientes', valor: '1.2', min: 1.0, max: 1.5 }
      ],
      tieneCamara: true
    }
  };

  constructor() { }

  // Esta es la función que te marcaba error TS2339
  getNombresTipos() {
    return Object.keys(this.configuraciones).map(key => ({
      nombre: this.configuraciones[key].nombre,
      valor: key 
    }));
  }

  // Esta es la otra función que te marcaba error TS2339
  crearInvernadero(nombre: string, tipo: string) {
    const config = this.configuraciones[tipo] || this.configuraciones['tradicional'];

    return {
      id: Date.now().toString(), 
      nombre: nombre,
      ubicacion: 'Sin definir',
      estado: 'ONLINE',
      tieneCamara: config.tieneCamara,
      urlCamara: config.tieneCamara ? 'https://picsum.photos/400/300?1' : '',
      sensores: config.sensores.map((s: any) => ({
        nombre: s.nombre,
        valor: s.valor,
        min: s.min,
        max: s.max
      }))
    };
  }
}