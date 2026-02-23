
(function(){
  const $ = (s, p=document)=>p.querySelector(s);
  const $$ = (s, p=document)=>Array.from(p.querySelectorAll(s));

  // active nav
  const page = document.body.getAttribute("data-page");
  if(page){
    const link = document.querySelector(`.navlinks a[data-nav="${page}"]`);
    if(link) link.classList.add("active");
  }

  const header = $(".header");
  const hero = $(".hero");
  const heroMedia = $(".heroMedia");
  const stacks = $$(".posterWrap");

  function updateStacks(){
    stacks.forEach(wrap=>{
      const zone = wrap.closest(".posterZone");
      const stack = wrap.querySelector(".stripStack");
      if(!zone || !stack) return;
      const rect = zone.getBoundingClientRect();
      const zoneTop = rect.top;
      const zoneHeight = zone.offsetHeight;
      const viewH = window.innerHeight || 1;
      const totalScroll = Math.max(1, zoneHeight - viewH);
      const progressed = Math.min(totalScroll, Math.max(0, -zoneTop));
      const y = -Math.round(progressed * 0.65);
      stack.style.setProperty("--stackY", y + "px");
    });
  }

  function onScroll(){
    const y = window.scrollY || 0;
    if(hero && heroMedia){
      const h = hero.offsetHeight || 1;
      const p = Math.min(1, y / h);
      const heroY = -Math.round(220 * p);
      heroMedia.style.setProperty("--heroY", heroY + "px");
    }
    if(header && hero){
      const threshold = hero.offsetHeight * 0.33;
      if(y > threshold) header.classList.add("top");
      else header.classList.remove("top");
    } else if(header){
      header.classList.add("top");
    }
    updateStacks();
  }
  window.addEventListener("scroll", onScroll, { passive:true });
  window.addEventListener("resize", onScroll);
  if(location.hash === "#nav"){
    setTimeout(()=>window.scrollTo({ top: Math.round((hero?.offsetHeight||800)*0.36), behavior:"instant" }), 10);
  }
  onScroll();
})();


// v4: simple modal + basic no-save UX
(function(){
  const root = document.body;

  // Disable right-click (best-effort; not a security control)
  if(root && root.classList.contains('noSave')){
    document.addEventListener('contextmenu', (e)=>{
      const t = e.target;
      if(!t) return;
      const isMedia = t.tagName === 'IMG' || t.tagName === 'VIDEO' || !!t.closest('img') || !!t.closest('video');
      if(isMedia) e.preventDefault();
    });
  }

  function openModal(id){
    const m = document.getElementById(id);
    if(!m) return;
    m.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('modal-open');
  }

  function closeModal(id){
    const m = document.getElementById(id);
    if(!m) return;
    m.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('modal-open');
  }

  document.addEventListener('click', (e)=>{
    const open = e.target && e.target.closest ? e.target.closest('[data-modal-open]') : null;
    if(open){
      e.preventDefault();
      openModal(open.getAttribute('data-modal-open'));
      return;
    }

    const close = e.target && e.target.closest ? e.target.closest('[data-modal-close]') : null;
    if(close){
      e.preventDefault();
      closeModal(close.getAttribute('data-modal-close'));
    }
  });

  document.addEventListener('keydown', (e)=>{
    if(e.key !== 'Escape') return;
    const m = document.querySelector('.modal[aria-hidden="false"]');
    if(m) closeModal(m.id);
  });
})();
