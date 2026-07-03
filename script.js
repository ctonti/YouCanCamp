document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('deck-container');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const progressBar = document.getElementById('progress-bar');
  const counterSpan = document.getElementById('current-slide-num');
  const totalSpan = document.getElementById('total-slides-num');
  
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const gridBtn = document.getElementById('grid-btn');
  
  let currentIdx = 0;
  let isOverview = false;
  
  // Set total slide count in footer
  if (totalSpan) totalSpan.textContent = slides.length;
  
  // Initialize dataset indexing for Overview Mode
  slides.forEach((slide, idx) => {
    slide.setAttribute('data-index', idx + 1);
    
    // Add title attribute as thumbnail helper
    const titleEl = slide.querySelector('h1') || slide.querySelector('h2');
    if (titleEl) {
      const thumbTitle = document.createElement('div');
      thumbTitle.className = 'slide-thumbnail-title';
      thumbTitle.textContent = titleEl.textContent.trim();
      slide.querySelector('.slide-content').appendChild(thumbTitle);
    }
    
    // Click on slide during overview mode navigates directly
    slide.addEventListener('click', () => {
      if (isOverview) {
        goToSlide(idx);
        toggleOverview(false);
      }
    });
  });
  
  function updatePresentation() {
    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'past');
      if (idx === currentIdx) {
        slide.classList.add('active');
      } else if (idx < currentIdx) {
        slide.classList.add('past');
      }
    });
    
    // Update progress bar
    if (progressBar && slides.length > 1) {
      const percentage = (currentIdx / (slides.length - 1)) * 100;
      progressBar.style.width = `${percentage}%`;
    }
    
    // Update counter
    if (counterSpan) {
      counterSpan.textContent = currentIdx + 1;
    }
  }
  
  function goToSlide(idx) {
    if (idx >= 0 && idx < slides.length) {
      currentIdx = idx;
      updatePresentation();
    }
  }
  
  function nextSlide() {
    if (currentIdx < slides.length - 1) {
      goToSlide(currentIdx + 1);
    }
  }
  
  function prevSlide() {
    if (currentIdx > 0) {
      goToSlide(currentIdx - 1);
    }
  }
  
  function toggleOverview(forceState) {
    isOverview = forceState !== undefined ? forceState : !isOverview;
    if (isOverview) {
      container.classList.add('overview-mode');
    } else {
      container.classList.remove('overview-mode');
      // Scroll back to top on exit
      window.scrollTo(0, 0);
    }
  }
  
  // Keyboard Events
  document.addEventListener('keydown', (e) => {
    // If overview mode, Escape exits overview
    if (e.key === 'Escape' && isOverview) {
      toggleOverview(false);
      return;
    }
    
    // O key toggles overview mode
    if (e.key.toLowerCase() === 'o') {
      toggleOverview();
      return;
    }
    
    // If in overview, block arrows from standard transition (optional, or allow them to navigate grid)
    if (isOverview) return;
    
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToSlide(slides.length - 1);
    }
  });
  
  // Navigation button controls
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (gridBtn) gridBtn.addEventListener('click', () => toggleOverview());
  
  // Simple Swipe Gestures for Mobile Presentation
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  document.addEventListener('touchend', (e) => {
    if (isOverview) return;
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide(); // Swipe left -> Next
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide(); // Swipe right -> Prev
    }
  }
  
  // Initial presentation state
  updatePresentation();
});
