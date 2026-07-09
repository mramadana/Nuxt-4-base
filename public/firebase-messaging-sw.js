// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDe7kPfYxhXdn38eiNMDtKNWVLbgn66pLk",
  authDomain: "asas-wa-tamem.firebaseapp.com",
  projectId: "asas-wa-tamem",
  storageBucket: "asas-wa-tamem.firebasestorage.app",
  messagingSenderId: "807784913498",
  appId: "1:807784913498:web:bb88bd9a1abe2175f55663",
  measurementId: "G-5SSSRKEG81"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/logo.svg'
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);


    self.addEventListener("notificationclick", (event) => {
      event.notification.close();
      event.waitUntil(
      clients.openWindow("https://oshakstore.com/") // Update with your URL
      );
      });

  });