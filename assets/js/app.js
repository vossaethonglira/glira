// ===== Anti-download friction (cannot be absolute) =====
(function(){
  // Disable right-click context menu
  document.addEventListener('contextmenu', function(e){
    e.preventDefault();
  }, { passive: false });

  // Disable drag for images/videos
  document.addEventListener('dragstart', function(e){
    const t = e.target;
    if (t && (t.tagName === 'IMG' || t.tagName === 'VIDEO' || t.tagName === 'SOURCE')) {
      e.preventDefault();
    }
  }, { passive: false });

  // Optional: block long-press save on some mobile browsers (limited)
  document.addEventListener('touchstart', function(){}, {passive:true});
})();
