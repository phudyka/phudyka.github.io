/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   background.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: phudyka <phudyka@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/23 02:37:11 by phudyka           #+#    #+#             */
/*   Updated: 2025/03/23 02:49:49 by phudyka          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

document.addEventListener('DOMContentLoaded', function() {
    // Vérification que Three.js est chargé
    if (typeof THREE === 'undefined') {
      console.error('Three.js n\'est pas chargé correctement');
      return;
    }
    
    // Vérification que le conteneur existe
    const container = document.getElementById('background-container');
    if (!container) {
      console.error('Le conteneur #background-container n\'existe pas');
      return;
    }
    
    console.log('Initialisation de l\'animation Three.js');
    
    // Configuration de base
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Création du renderer avec meilleure qualité
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Création de particules améliorées
    const particles = [];
    const particleCount = window.innerWidth <= 768 ? 40 : 80; // Plus de particules
    
    // Couleurs basées sur votre thème
    const colors = [
      new THREE.Color('#dd5d2a'), // Couleur primaire
      new THREE.Color('#ff7e54'), // Gradient primaire fin
      new THREE.Color('#fba88f')  // Couleur secondaire
    ];
    
    // Tailles variées pour plus de dynamisme
    const sizes = [0.15, 0.2, 0.3, 0.4];
    
    // Création de particules avec aspect plus organique
    for (let i = 0; i < particleCount; i++) {
      // Sélection aléatoire de la taille et couleur
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Géométrie avec plus de segments pour un aspect plus arrondi
      const particleGeometry = new THREE.SphereGeometry(size, 12, 12);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: Math.random() * 0.5 + 0.3 // Opacité variable
      });
      
      const particle = new THREE.Mesh(particleGeometry, material);
      
      // Position aléatoire plus étendue
      particle.position.x = (Math.random() - 0.5) * 50;
      particle.position.y = (Math.random() - 0.5) * 50;
      particle.position.z = (Math.random() - 0.5) * 15;
      
      // Vitesse aléatoire plus lente pour un effet plus élégant
      particle.velocity = {
        x: (Math.random() - 0.5) * 0.04,
        y: (Math.random() - 0.5) * 0.04,
        z: (Math.random() - 0.5) * 0.01
      };
      
      // Paramètres pour l'animation de pulsation
      particle.pulseFactor = Math.random() * 0.1 + 0.05;
      particle.pulseSpeed = Math.random() * 0.01 + 0.005;
      particle.pulseOffset = Math.random() * Math.PI * 2;
      
      particles.push(particle);
      scene.add(particle);
    }
    
    // Ajout de lignes de connexion entre particules proches
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xfba88f,
      transparent: true,
      opacity: 0.2
    });
    
    const lines = [];
    const maxDistance = 10; // Distance maximale pour connecter des particules
    
    function updateLines() {
      // Suppression des anciennes lignes
      lines.forEach(line => {
        scene.remove(line);
        line.geometry.dispose();
      });
      lines.length = 0;
      
      // Création de nouvelles connexions
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          
          const distance = p1.position.distanceTo(p2.position);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            const geometry = new THREE.BufferGeometry().setFromPoints([p1.position, p2.position]);
            const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
              color: 0xfba88f,
              transparent: true,
              opacity: opacity * 0.2
            }));
            scene.add(line);
            lines.push(line);
          }
        }
      }
    }
    
    let mouseX = 0;
    let mouseY = 0;
    
    // Gestionnaire d'événements pour la souris
    document.addEventListener('mousemove', function(event) {
      mouseX = (event.clientX - window.innerWidth / 2);
      mouseY = (event.clientY - window.innerHeight / 2);
    });
    
    // Gestionnaire d'événements pour le redimensionnement
    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Compteur pour limiter la mise à jour des lignes (optimisation)
    let frameCount = 0;
    
    // Fonction d'animation améliorée
    function animate() {
      requestAnimationFrame(animate);
      
      // Mise à jour des particules avec effet de pulsation
      const time = Date.now() * 0.001; // Temps en secondes
      
      particles.forEach(particle => {
        // Mouvement de base
        particle.position.x += particle.velocity.x + (mouseX * 0.00005);
        particle.position.y += particle.velocity.y + (mouseY * 0.00005);
        particle.position.z += particle.velocity.z;
        
        // Effet de pulsation
        const pulse = Math.sin(time * particle.pulseSpeed + particle.pulseOffset);
        const scale = 1 + pulse * particle.pulseFactor;
        particle.scale.set(scale, scale, scale);
        
        // Légère rotation
        particle.rotation.x += 0.002;
        particle.rotation.y += 0.003;
        
        // Rebond sur les bords
        const limit = 25;
        if (Math.abs(particle.position.x) > limit) {
          particle.velocity.x = -particle.velocity.x;
        }
        if (Math.abs(particle.position.y) > limit) {
          particle.velocity.y = -particle.velocity.y;
        }
        if (Math.abs(particle.position.z) > limit) {
          particle.velocity.z = -particle.velocity.z;
        }
      });
      
      // Mise à jour des lignes (pas à chaque frame pour optimiser)
      frameCount++;
      if (frameCount % 10 === 0) {
        updateLines();
      }
      
      // Rotation subtile de la caméra
      camera.position.x += (mouseX * 0.01 - camera.position.x) * 0.01;
      camera.position.y += (-mouseY * 0.01 - camera.position.y) * 0.01;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    }
    
    // Démarrer l'animation
    animate();
    
    console.log('Animation Three.js améliorée démarrée');
});