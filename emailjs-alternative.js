// Alternative avec EmailJS (plus simple, fonctionne côté client)
// Remplacez le code du formulaire dans script.js par celui-ci

// 1. Ajoutez ce script dans index.html avant </body>:
// <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

// 2. Initialisez EmailJS (remplacez YOUR_PUBLIC_KEY par votre clé)
emailjs.init("YOUR_PUBLIC_KEY");

// 3. Remplacez la fonction du formulaire dans script.js par ceci:

const contactForm = document.querySelector('.contact-form');
if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: contactForm.querySelector('input[name="name"]').value.trim(),
            email: contactForm.querySelector('input[name="email"]').value.trim(),
            subject: contactForm.querySelector('input[name="subject"]').value.trim(),
            message: contactForm.querySelector('textarea[name="message"]').value.trim()
        };
        
        const submitBtn = contactForm.querySelector('input[type="submit"]');
        const originalText = submitBtn.value || 'Envoyer';
        
        // Validation
        if (!formData.name || formData.name.length < 2) {
            showFormMessage(contactForm, 'Le nom est requis (minimum 2 caractères)', false);
            return;
        }
        
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            showFormMessage(contactForm, 'Une adresse email valide est requise', false);
            return;
        }
        
        if (!formData.subject || formData.subject.length < 3) {
            showFormMessage(contactForm, 'Le sujet est requis (minimum 3 caractères)', false);
            return;
        }
        
        if (!formData.message || formData.message.length < 10) {
            showFormMessage(contactForm, 'Le message est requis (minimum 10 caractères)', false);
            return;
        }
        
        // Désactiver le bouton
        submitBtn.disabled = true;
        submitBtn.value = 'Envoi en cours...';
        
        // Envoyer avec EmailJS
        // Remplacez SERVICE_ID et TEMPLATE_ID par vos valeurs depuis EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_email: 'rodrigueotsina@gmail.com'
        })
        .then(function() {
            showFormMessage(contactForm, 'Votre message a été envoyé avec succès ! Je vous répondrai bientôt.', true);
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.value = originalText;
        }, function(error) {
            console.error('Erreur EmailJS:', error);
            showFormMessage(contactForm, 'Erreur lors de l\'envoi. Veuillez réessayer plus tard.', false);
            submitBtn.disabled = false;
            submitBtn.value = originalText;
        });
    });
}

function showFormMessage(form, message, isSuccess) {
    let messageDiv = form.querySelector('.form-message');
    if(!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.className = 'form-message';
        form.appendChild(messageDiv);
    }
    
    messageDiv.style.color = isSuccess ? '#37b182' : '#ec1819';
    messageDiv.textContent = message;
    messageDiv.style.opacity = '1';
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            if(messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 5000);
}
