/* Self-destroying service worker.
   Neutralizes any stale service worker left by the previous tvastra.design site.
   When an old SW checks for an update, the browser fetches this file, installs it,
   and this code deletes all caches, unregisters the SW, and reloads open tabs so
   they load the current site fresh from the network. */
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(event){
  event.waitUntil((async function(){
    try {
      var keys = await caches.keys();
      await Promise.all(keys.map(function(k){ return caches.delete(k); }));
    } catch(e){}
    try { await self.registration.unregister(); } catch(e){}
    try {
      var clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(function(c){ try { c.navigate(c.url); } catch(e){} });
    } catch(e){}
  })());
});
