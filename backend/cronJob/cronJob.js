const cron = require('node-cron');
const { checkSecurityStock } = require('../controllers/equipementController');

// Définir la tâche planifiée pour s'exécuter toutes les 5 minutes
cron.schedule('*/5 * * * *', () => {
    console.log('Vérification du stock de sécurité des équipements...');
    checkSecurityStock();
});
