let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // --- Eventos de MOUSE ---
    document.addEventListener('mousemove', (e) => {
      if(!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
      this.handleMove(e.clientX, e.clientY, paper);
    });

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;

      if(e.button === 0) { // Botão esquerdo do mouse
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if(e.button === 2) { // Botão direito do mouse para rotação
        this.rotating = true;
      }
    });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // --- Eventos de TOQUE (para celular) ---
    document.addEventListener('touchmove', (e) => {
      // Previne o scroll padrão da página enquanto arrasta o papel
      e.preventDefault();
      const touch = e.touches[0];
      if(!this.rotating) {
        this.mouseX = touch.clientX;
        this.mouseY = touch.clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
      this.handleMove(touch.clientX, touch.clientY, paper);
    }, { passive: false }); // Usar { passive: false } para permitir preventDefault

    paper.addEventListener('touchstart', (e) => {
      if(this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;

      const touch = e.touches[0];
      this.mouseTouchX = touch.clientX;
      this.mouseTouchY = touch.clientY;
      this.prevMouseX = touch.clientX;
      this.prevMouseY = touch.clientY;

      // Para simular a rotação com toque (ex: segundo toque ou toque longo)
      // Isso pode precisar de um ajuste mais robusto para UX em celular.
      // Por enquanto, vamos manter a rotação apenas por mouse ou simplificar.
      // Se quiser rotação por toque longo:
      // if (e.touches.length === 2) { this.rotating = true; }
    });

    window.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // --- Função auxiliar para DRY (Don't Repeat Yourself) ---
    this.handleMove = (clientX, clientY, paper) => {
      const dirX = clientX - this.mouseTouchX;
      const dirY = clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);

      let degrees = this.rotation; // Mantém a rotação atual por padrão

      if(this.rotating) {
        // Recalcular rotação apenas se estivermos no modo de rotação
        const dirNormalizedX = dirX / dirLength;
        const dirNormalizedY = dirY / dirLength;
        const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
        degrees = (180 * angle / Math.PI + 360) % 360; // Normaliza para 0-360
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) { // Move apenas se não estiver rotacionando
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        this.prevMouseX = clientX; // Atualiza prevMouseX/Y com o cliente atual
        this.prevMouseY = clientY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
