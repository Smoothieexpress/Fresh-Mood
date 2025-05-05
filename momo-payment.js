class MoMoPayment {
  constructor(options) {
    // Configuration par défaut
    this.defaults = {
      currency: 'XOF',
      country: 'BJ',
      environment: 'test', // 'test' ou 'production'
      apiKey: '',
      provider: 'mtn', // 'mtn' ou 'moov'
      theme: 'dark', // 'dark' ou 'light'
      position: 'center' // 'center', 'left' ou 'right'
    };

    // Fusion des options
    this.settings = {...this.defaults, ...options};

    // Initialisation
    this.init();
  }

  init() {
    // Création de l'iframe de paiement
    this.createIframe();
    
    // Écouteur d'événements
    window.addEventListener('message', this.handleIframeMessages.bind(this));
  }

  createIframe() {
    // URL de base selon l'environnement
    const baseUrl = this.settings.environment === 'production' 
      ? 'https://api.momo-payment.com' 
      : 'https://sandbox.momo-payment.com';

    // Création de l'iframe
    this.iframe = document.createElement('iframe');
    this.iframe.src = `${baseUrl}/payment?provider=${this.settings.provider}&theme=${this.settings.theme}`;
    this.iframe.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      z-index: 9999;
      display: none;
      ${this.settings.position === 'left' ? 'transform: translateX(-100%);' : ''}
      ${this.settings.position === 'right' ? 'transform: translateX(100%);' : ''}
    `;
    document.body.appendChild(this.iframe);
  }

  handleIframeMessages(event) {
    const { data } = event;
    
    if (data.type === 'momo-payment-success') {
      this.onSuccess(data.payload);
    } else if (data.type === 'momo-payment-error') {
      this.onError(data.payload);
    } else if (data.type === 'momo-payment-close') {
      this.close();
    }
  }

  open(transaction) {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      // Envoi des données à l'iframe
      this.iframe.contentWindow.postMessage({
        type: 'momo-payment-init',
        payload: {
          ...transaction,
          apiKey: this.settings.apiKey,
          currency: this.settings.currency,
          country: this.settings.country
        }
      }, '*');

      // Affichage de l'iframe avec animation
      this.iframe.style.display = 'block';
      setTimeout(() => {
        this.iframe.style.transform = 'translateX(0)';
      }, 10);
    });
  }

  close() {
    // Animation de fermeture
    this.iframe.style.transform = this.settings.position === 'left' 
      ? 'translateX(-100%)' 
      : this.settings.position === 'right' 
        ? 'translateX(100%)' 
        : 'scale(0.9)';

    setTimeout(() => {
      this.iframe.style.display = 'none';
    }, 300);
  }

  onSuccess(payload) {
    if (this.resolve) {
      this.resolve({
        status: 'success',
        transactionId: payload.transactionId,
        amount: payload.amount,
        phone: payload.phone,
        date: new Date()
      });
    }
    this.close();
  }

  onError(error) {
    if (this.reject) {
      this.reject({
        status: 'error',
        code: error.code,
        message: this.getErrorMessage(error.code)
      });
    }
    this.close();
  }

  getErrorMessage(code) {
    const errors = {
      '001': 'Solde insuffisant',
      '002': 'Transaction annulée',
      '003': 'Numéro incorrect',
      '004': 'Erreur réseau',
      '005': 'Temps expiré',
      'default': 'Erreur inconnue'
    };
    return errors[code] || errors['default'];
  }

  destroy() {
    window.removeEventListener('message', this.handleIframeMessages);
    document.body.removeChild(this.iframe);
  }
}

// Méthode d'installation pour jQuery (optionnelle)
if (typeof jQuery !== 'undefined') {
  jQuery.fn.momoPayment = function(options) {
    return this.each(function() {
      const momo = new MoMoPayment(options);
      $(this).click(() => momo.open(options.transaction));
    });
  };
}
// Configuration de base
const momo = new MoMoPayment({
  apiKey: 'VOTRE_CLE_API', // À obtenir auprès de votre fournisseur
  provider: 'mtn', // ou 'moov'
  environment: 'test', // 'production' en live
  theme: 'dark',
  position: 'center'
});

// Exemple d'utilisation
document.getElementById('payer-btn').addEventListener('click', async () => {
  try {
    const result = await momo.open({
      amount: 5000, // Montant en XOF
      phone: '96123456', // Optionnel - pré-rempli
      reference: 'CMD12345', // Votre référence
      description: 'Achat Fresh Mood'
    });
    
    console.log('Paiement réussi:', result);
    // Rediriger ou afficher un message de succès
    
  } catch (error) {
    console.error('Erreur de paiement:', error);
    // Afficher un message d'erreur
  }
});
const express = require('express');
const axios = require('axios');
const app = express();

app.post('/api/process-payment', async (req, res) => {
  try {
    const response = await axios.post('https://api.momo-payment.com/process', {
      amount: req.body.amount,
      phone: req.body.phone,
      apiKey: process.env.MOMO_API_KEY,
      reference: req.body.reference
    });

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
