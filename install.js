const Service = require('node-windows').Service;

// Create a new service object
const svc = new Service({
    name: 'AKS Clinic',
    description: 'This is a node server that runs as the windows service that keeps the server always up!',
    script: require('path').join('D:/AKS_Mobile APP/AKS_Node/src', 'app.js')
});

// Listen for the "install" event, which indicates the
// process is available as a service.

svc.on('install', () => {
    svc.start();
});

svc.on('alreadyinstalled', () => {
    console.log('Already Installed');
});

svc.on('start', () => {
    console.log(svc.name +' started! \n Visit http://127.0.0.1:3000 to see it in action.');
});

svc.install();