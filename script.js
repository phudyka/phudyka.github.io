/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   script.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: phudyka <phudyka@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/21 12:02:52 by phudyka           #+#    #+#             */
/*   Updated: 2025/03/23 13:43:52 by phudyka          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Vos identifiants EmailJS
const serviceID = 'service_sjs7c46';
const templateID = 'template_niul59s';
const userID = 'gzzVtxDO3oIgIpc_U';


document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");

    if (typeof emailjs === 'undefined') {
        console.error("EmailJS library not loaded!");
    } else {
        console.log("EmailJS library detected, initializing...");
        emailjs.init(userID);
        console.log("EmailJS initialized with userID:", userID);
    }

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease',
            once: true,
            offset: 100
        });
    }

    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    if (burger && nav && navLinks) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            
            burger.classList.toggle('toggle');
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            if (nav && nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        console.log("Contact form found");
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');

            if (typeof emailjs === 'undefined') {
                console.error("EmailJS not available when submitting form");
                alert("Le service d'email n'est pas disponible. Veuillez réessayer plus tard ou me contacter directement à paul.hudyka@gmail.com");
                return;
            }

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            console.log('Form data:', { name, email, message });

            if (!name || !email || !message) {
                alert("Tous les champs doivent être remplis.");
                return;
            }
            
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Veuillez entrer une adresse e-mail valide.");
                return;
            }
            
            const templateParams = {
                from_name: name,
                from_email: email,
                message: message,
                to_email: 'paul.hudyka@gmail.com'
            };
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
                submitBtn.disabled = true;
            }

            console.log("Attempting to send email with params:", templateParams);
            
            emailjs.send(serviceID, templateID, templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    alert(`Merci ${name}! Votre message a été envoyé.`);
                    contactForm.reset();
                    
                    if (submitBtn) {
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer';
                        submitBtn.disabled = false;
                    }
                })
                .catch(function(error) {
                    console.error('FAILED...', error);
                    alert("Une erreur est survenue lors de l'envoi: " + (error.text || "Erreur inconnue"));
                    
                    if (submitBtn) {
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer';
                        submitBtn.disabled = false;
                    }
                });
        });
    } else {
        console.error("Contact form not found in the document");
    }
        
    const header = document.querySelector('nav');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.97)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }
        });
    }
});