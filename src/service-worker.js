/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Precache los archivos generados en la compilación
precacheAndRoute(self.__WB_MANIFEST || []);

// Estrategia para manejar peticiones de imágenes
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'images-cache',
  })
);

// Evento de instalación
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

// Evento de activación
self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');
  self.clients.claim(); // 🔥 SOLUCIÓN: Usar self.clients en lugar de clients
});

// Evento de fetch (para interceptar peticiones)
self.addEventListener('fetch', (event) => {
  console.log('Interceptando petición: ', event.request.url);
});
