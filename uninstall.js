const Service = require('node-windows').Service;

// Create a new service object
const svc = new Service({
    name: 'AKS Clinic',
    script: require('path').join('D:/AKS_Mobile APP/AKS_Node/src', 'app.js')
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', () => {
    console.log('Uninstall complete.');
    console.log('The service exists: ',svc.exists);
});

svc.uninstall();