document.addEventListener('DOMContentLoaded', () => {
  const btnPlayPause = document.getElementById('btn-play-pause');
  const btnIcon = document.getElementById('btn-icon');
  const btnText = document.getElementById('btn-text');
  const canvasContainer = document.getElementById('canvas-container');
  const stageWrapper = document.getElementById('stage-wrapper');
  const hotspots = document.querySelectorAll('.hotspot');
  const poemaText = document.getElementById('poema-text');
  const allAudios = document.querySelectorAll('audio');

  let isPlaying = false;

  canvasContainer.classList.add('paused');

  // Activar bucle continuo en todos los audios
  allAudios.forEach(audio => {
    audio.loop = true;
  });

  // Alinear el fondo a color de cada hotspot con el tamaño total del contenedor
  function sincronizarCapasDeColor() {
    const stageWidth = stageWrapper.clientWidth;
    const stageHeight = stageWrapper.clientHeight;

    hotspots.forEach(spot => {
      const colorDiv = spot.querySelector('.spot-color');
      if (!colorDiv) return;

      const spotLeft = spot.offsetLeft;
      const spotTop = spot.offsetTop;

      colorDiv.style.backgroundSize = `${stageWidth}px ${stageHeight}px`;
      colorDiv.style.backgroundPosition = `-${spotLeft}px -${spotTop}px`;
    });
  }

  window.addEventListener('resize', sincronizarCapasDeColor);
  window.addEventListener('load', sincronizarCapasDeColor);
  setTimeout(sincronizarCapasDeColor, 300);

  // Play / Pausa general
  btnPlayPause.addEventListener('click', () => {
    isPlaying = !isPlaying;

    if (isPlaying) {
      btnPlayPause.classList.add('active');
      btnIcon.textContent = '❚❚';
      btnText.textContent = 'PAUSA';
      canvasContainer.classList.remove('paused');
      poemaText.textContent = '« Obra activa: toca las figuras para sumar capas sonoras y color »';
      sincronizarCapasDeColor();
    } else {
      btnPlayPause.classList.remove('active');
      btnIcon.textContent = '▶';
      btnText.textContent = 'PLAY';
      canvasContainer.classList.add('paused');
      poemaText.textContent = '« Obra en pausa »';

      allAudios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });

      hotspots.forEach(spot => spot.classList.remove('is-active'));
    }
  });

  // Control individual por figura (Toggle)
  hotspots.forEach(spot => {
    spot.addEventListener('click', (event) => {
      if (!isPlaying) return;

      const soundKey = spot.getAttribute('data-sound');
      const poema = spot.getAttribute('data-poema');
      const audio = document.getElementById(`audio-${soundKey}`);
      const yaActivo = spot.classList.contains('is-active');

      if (yaActivo) {
        // Apagar sonido y decolorar
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        spot.classList.remove('is-active');
      } else {
        // Encender sonido en loop y colorear permanentemente
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(e => console.warn('Audio bloqueado:', e));
        }
        spot.classList.add('is-active');

        poemaText.style.opacity = 0;
        setTimeout(() => {
          poemaText.textContent = `« ${poema} »`;
          poemaText.style.opacity = 1;
        }, 120);

        // Onda expansiva en el clic
        const rect = stageWrapper.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;

        stageWrapper.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }
    });
  });
});