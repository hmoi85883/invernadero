import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
  IonSegment, IonSegmentButton, IonLabel, IonContent, IonIcon,
  IonRippleEffect, IonButton 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
// 👇 1. IMPORTAMOS EL ICONO NUEVO (settingsOutline)
import { 
  createOutline, thermometer, water, sunny, hardwareChip, 
  arrowBackOutline, chevronForward, barChartOutline, add, pulseOutline,
  settingsOutline 
} from 'ionicons/icons';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
    IonSegment, IonSegmentButton, IonLabel, IonContent, IonIcon,
    IonRippleEffect, IonButton
  ]
})
export class DetallePage implements OnDestroy {
  seccion = 'monitor';
  intervalo: any;
  chart: any = null;

  constructor(private route: ActivatedRoute, public data: DataService) {
    // 👇 2. LO REGISTRAMOS AQUÍ PARA QUE SEA VISIBLE
    addIcons({ 
      'create-outline': createOutline, 'arrow-back-outline': arrowBackOutline, 
      'bar-chart-outline': barChartOutline, 'pulse-outline': pulseOutline,
      'settings-outline': settingsOutline, // <--- AQUÍ ESTÁ
      thermometer, water, sunny, 'hardware-chip': hardwareChip,
      'chevron-forward': chevronForward, add
    });
  }

  ionViewDidEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    this.cargar(id);
    
    this.intervalo = setInterval(() => {
      this.cargar(id);
      if (this.seccion === 'graficas' && this.chart) {
        this.actualizarGrafica();
      }
    }, 5000);
  }
  
  ionViewWillLeave() { this.limpiar(); }
  ngOnDestroy() { this.limpiar(); }
  
  limpiar() {
    if (this.intervalo) clearInterval(this.intervalo);
    if (this.chart) this.chart.destroy();
  }
  
  cargar(id: any) { if(id) this.data.cargarUnico(id); }

  // --- GRÁFICA ---
  segmentChanged(ev: any) {
    this.seccion = ev.detail.value;
    if (this.seccion === 'graficas') {
      setTimeout(() => this.iniciarGrafica(), 300);
    }
  }

  iniciarGrafica() {
    const canvas = document.getElementById('lineCanvas') as HTMLCanvasElement;
    if (!canvas) {
      setTimeout(() => this.iniciarGrafica(), 500); 
      return;
    }
    if (this.chart) this.chart.destroy();
    const historial = this.generarDatosSimulados();

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['-25s', '-20s', '-15s', '-10s', '-5s', 'Ahora'],
        datasets: [
          {
            label: 'Temp (°C)',
            data: historial.temp,
            borderColor: '#00d462',
            backgroundColor: 'rgba(0, 212, 98, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#121212'
          },
          {
            label: 'Humedad (%)',
            data: historial.hum,
            borderColor: '#00bcd4',
            backgroundColor: 'rgba(0, 188, 212, 0.05)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#e0e0e0', font: { size: 12 } } } },
        scales: {
          y: { grid: { color: '#333' }, ticks: { color: '#888' } },
          x: { grid: { display: false }, ticks: { color: '#888' } }
        },
        animation: { duration: 0 }
      }
    });
  }

  actualizarGrafica() {
    if (!this.data.invernaderoActual || !this.chart) return;
    const tempSensor = this.data.invernaderoActual.sensores.find((s:any) => s.nombre.toLowerCase().includes('temp') || s.nombre.toLowerCase().includes('°c'));
    const humSensor = this.data.invernaderoActual.sensores.find((s:any) => s.nombre.toLowerCase().includes('hum') || s.nombre.toLowerCase().includes('%'));
    const nuevaTemp = tempSensor ? parseFloat(tempSensor.valor) : 0;
    const nuevaHum = humSensor ? parseFloat(humSensor.valor) : 0;
    const dataTemp = this.chart.data.datasets[0].data;
    const dataHum = this.chart.data.datasets[1].data;
    dataTemp.shift(); dataTemp.push(nuevaTemp);
    dataHum.shift(); dataHum.push(nuevaHum);
    this.chart.update('none');
  }

  generarDatosSimulados() {
    let baseTemp = 25; let baseHum = 50;
    if (this.data.invernaderoActual) {
       const t = this.data.invernaderoActual.sensores.find((s:any) => s.nombre.toLowerCase().includes('temp'));
       if(t) baseTemp = parseFloat(t.valor);
    }
    return {
      temp: [baseTemp-1, baseTemp+0.5, baseTemp-0.2, baseTemp+1, baseTemp-0.5, baseTemp],
      hum: [baseHum+2, baseHum-1, baseHum+3, baseHum-2, baseHum+1, baseHum]
    };
  }
}