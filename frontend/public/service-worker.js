self.addEventListener('push', (event) => {
  console.log('Push received:', event);
  
  const data = event.data?.json() || {};
  const title = data.title || 'New Notification';
  const options = {
    body: data.body || '',
    icon: data.icon || '/logo.png',
    badge: data.badge || '/logo.png',
    data: data.data || {},
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.openWindow(url)
  );
});