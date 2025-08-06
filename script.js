// Initialize EmailJS
emailjs.init('pc80mlmP761oFj8YB');

// Mobile navigation toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = document.getElementById('menuIcon');
    
    mobileNav.classList.toggle('show');
    
    if (mobileNav.classList.contains('show')) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
    } else {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
});

// FAQ functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Scroll to section function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 80;
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    // Close mobile menu if open
    closeMobileNav();
}

// Close mobile navigation
function closeMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = document.getElementById('menuIcon');
    
    if (mobileNav && menuIcon && mobileNav.classList.contains('show')) {
        mobileNav.classList.remove('show');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
}

// Form submission handler
document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Envoi en cours...';
    submitBtn.disabled = true;
    
    try {
        // Get form data
        const formData = new FormData(this);
        
        // Validate required fields
        const requiredFields = ['service', 'plan', 'customerName', 'whatsappNumber', 'customerEmail', 'secretCode'];
        
        for (const fieldName of requiredFields) {
            const value = formData.get(fieldName);
            if (!value || !value.trim()) {
                throw new Error(`Le champ "${fieldName}" est requis`);
            }
        }
        
        // Validate email format
        const email = formData.get('customerEmail');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Veuillez entrer une adresse email valide');
        }
        
        // Validate phone number format
        const phone = formData.get('whatsappNumber');
        const phoneRegex = /^\+?[0-9\s-]{10,}$/;
        if (!phoneRegex.test(phone)) {
            throw new Error('Veuillez entrer un numéro de téléphone valide');
        }
        
        // Prepare template parameters
        const templateParams = prepareTemplateParams(formData);
        
        // Send emails to multiple recipients
        const emailPromises = [];
        
        // Email 1 - Premier destinataire
        const email1Params = {
            ...templateParams,
            to_email: 'djephlymesadieu@gmail.com',
            cc_email: 'graciengarbens@gmail.com'
        };
        
        emailPromises.push(
            emailjs.send('service_z7uyhtc', 'template_hltw6tm', email1Params, 'pc80mlmP761oFj8YB')
        );
        
        // Email 2 - Deuxième destinataire  
        const email2Params = {
            ...templateParams,
            to_email: 'Bintzberrygracien84@gmail.com',
            cc_email: 'graciengarbens@gmail.com'
        };
        
        emailPromises.push(
            emailjs.send('service_z7uyhtc', 'template_hltw6tm', email2Params, 'pc80mlmP761oFj8YB')
        );
        
        // Attendre l'envoi des deux emails
        const results = await Promise.all(emailPromises);
        
        console.log('Emails sent successfully:', results);
        
        // Show success message
        document.querySelector('.order-form').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
        // Scroll to success message
        document.getElementById('successMessage').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
    } catch (error) {
        console.error('Error sending email:', error);
        alert('Erreur lors de l\'envoi de la commande: ' + error.message);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Prepare template parameters for EmailJS
function prepareTemplateParams(formData) {
    // Service and plan name mappings
    const serviceNames = {
        disney: 'Disney+',
        netflix: 'Netflix', 
        hbo: 'HBO Max',
        prime: 'Prime Video',
        all: 'Tous les services'
    };
    
    const planNames = {
        monthly: 'Plan Mensuel - 500 HTG',
        quarterly: 'Plan 3 Mois - 1000 HTG'
    };
    
    return {
        service_name: serviceNames[formData.get('service')] || formData.get('service'),
        plan_name: planNames[formData.get('plan')] || formData.get('plan'),
        customer_name: formData.get('customerName'),
        whatsapp_number: formData.get('whatsappNumber'),
        customer_email: formData.get('customerEmail'),
        secret_code: formData.get('secretCode'),
        order_date: new Date().toLocaleString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        to_email_1: 'djephlymesadieu@gmail.com',
        to_email_2: 'Bintzberrygracien84@gmail.com',
        order_summary: `
🎬 NOUVO KÒMAND CINE LAKAY

📋 DETAY KLIYAN:
👤 Non: ${formData.get('customerName')}
📱 WhatsApp: ${formData.get('whatsappNumber')}
📧 Email: ${formData.get('customerEmail')}
🔐 Kòd sekrè: ${formData.get('secretCode')}

🎥 KÒMAND:
Sèvis: ${serviceNames[formData.get('service')] || formData.get('service')}
Plan: ${planNames[formData.get('plan')] || formData.get('plan')}
Dat: ${new Date().toLocaleString('fr-FR')}

📲 PÈMÈN PA MONCASH: +509 35 06 0742
⚠️ Kliyan an ap voye foto preuve pèmèn an nan WhatsApp oswa email

📋 RÈGLEMAN YO:
• Kont yo se pou yon sèl moun sèlman
• Si gen plizye moun ki konekte, nou ap dekonekte tout moun yo
• Si nou chanje mod passe a, kliyan an pap dekonekte
• Si dekoneksyon san rezon, nou gen 2h pou rezoud pwoblèm lan
• Rembouman akseptab si gen bon rezon ak nan 30 jou
        `
    };
}

// Reset form function
function resetForm() {
    document.getElementById('orderForm').reset();
    document.querySelector('.order-form').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    
    // Scroll to form
    document.getElementById('order').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.nav-glass');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.8)';
    }
});

// Contact button functionality
function openWhatsApp() {
    window.open('https://wa.me/50935060742', '_blank');
}

function makeCall() {
    window.open('tel:+50935060742', '_self');
}

// Add smooth scrolling to all internal links
document.addEventListener('DOMContentLoaded', function() {
    // Add click listeners to all navigation buttons
    const navButtons = document.querySelectorAll('.nav-links button, .mobile-nav button');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeMobileNav();
        });
    });
    
    // Enhanced form validation
    const form = document.getElementById('orderForm');
    const inputs = form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
});

// Field validation function
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove existing error styling
    clearFieldError(field);
    
    if (!value) {
        showFieldError(field, 'Ce champ est requis');
        return false;
    }
    
    // Specific validations
    switch(fieldName) {
        case 'customerEmail':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Veuillez entrer une adresse email valide');
                return false;
            }
            break;
            
        case 'whatsappNumber':
            const phoneRegex = /^\+?[0-9\s-]{10,}$/;
            if (!phoneRegex.test(value)) {
                showFieldError(field, 'Veuillez entrer un numéro de téléphone valide');
                return false;
            }
            break;
            
        case 'customerName':
            if (value.length < 2) {
                showFieldError(field, 'Le nom doit contenir au moins 2 caractères');
                return false;
            }
            break;
    }
    
    return true;
}

// Show field error
function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.style.borderColor = '';
    
    const errorMessage = field.parentNode.querySelector('.field-error');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Enhanced success message with auto-scroll
function showSuccessMessage() {
    const successDiv = document.getElementById('successMessage');
    successDiv.style.display = 'block';
    
    // Add celebration animation
    successDiv.style.animation = 'celebration 0.5s ease-out';
    
    setTimeout(() => {
        successDiv.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }, 100);
}

// Add celebration keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes celebration {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);
