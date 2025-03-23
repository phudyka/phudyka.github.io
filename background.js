/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   background.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: phudyka <phudyka@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/23 02:37:11 by phudyka           #+#    #+#             */
/*   Updated: 2025/03/23 13:43:23 by phudyka          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

document.addEventListener('DOMContentLoaded', function() {
    if (typeof THREE === 'undefined') {
      console.error('Three.js failed');
      return;
    }
    
    const container = document.getElementById('background-container');
    if (!container) {
      console.error('#background-container doesnt exist');
      return;
    }
    
    console.log('Initialisation');
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    const particles = [];
    const particleCount = window.innerWidth <= 768 ? 40 : 80; 
    
    const colors = [
      new THREE.Color('#dd5d2a'), 
      new THREE.Color('#ff7e54'), 
      new THREE.Color('#fba88f') 
    ];
    
    const sizes = [0.15, 0.2, 0.3, 0.4];
    
    for (let i = 0; i < particleCount; i++) {
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const particleGeometry = new THREE.SphereGeometry(size, 12, 12);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: Math.random() * 0.5 + 0.3 
      });
      
      const particle = new THREE.Mesh(particleGeometry, material);
      
      particle.position.x = (Math.random() - 0.5) * 50;
      particle.position.y = (Math.random() - 0.5) * 50;
      particle.position.z = (Math.random() - 0.5) * 15;
      
      particle.velocity = {
        x: (Math.random() - 0.5) * 0.04,
        y: (Math.random() - 0.5) * 0.04,
        z: (Math.random() - 0.5) * 0.01
      };
      
      particle.pulseFactor = Math.random() * 0.1 + 0.05;
      particle.pulseSpeed = Math.random() * 0.01 + 0.005;
      particle.pulseOffset = Math.random() * Math.PI * 2;
      
      particles.push(particle);
      scene.add(particle);
    }
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xfba88f,
      transparent: true,
      opacity: 0.2
    });
    
    const lines = [];
    const maxDistance = 10; 
    
    function updateLines() {
      lines.forEach(line => {
        scene.remove(line);
        line.geometry.dispose();
      });
      lines.length = 0;
      
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
    
    document.addEventListener('mousemove', function(event) {
      mouseX = (event.clientX - window.innerWidth / 2);
      mouseY = (event.clientY - window.innerHeight / 2);
    });
    
    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    let frameCount = 0;
    
    function animate() {
      requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      particles.forEach(particle => {
        particle.position.x += particle.velocity.x + (mouseX * 0.00005);
        particle.position.y += particle.velocity.y + (mouseY * 0.00005);
        particle.position.z += particle.velocity.z;
        
        const pulse = Math.sin(time * particle.pulseSpeed + particle.pulseOffset);
        const scale = 1 + pulse * particle.pulseFactor;
        particle.scale.set(scale, scale, scale);
        
        particle.rotation.x += 0.002;
        particle.rotation.y += 0.003;
        
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
      
      frameCount++;
      if (frameCount % 10 === 0) {
        updateLines();
      }
      
      camera.position.x += (mouseX * 0.01 - camera.position.x) * 0.01;
      camera.position.y += (-mouseY * 0.01 - camera.position.y) * 0.01;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    }
    
    animate();
    
    console.log('Particule animation running');
});