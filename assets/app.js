
(function(){
  const $ = (s, p=document)=>p.querySelector(s);
  const $$ = (s, p=document)=>Array.from(p.querySelectorAll(s));
  const page = document.body.getAttribute("data-page");
  if(page){
    const link = document.querySelector(`.navlinks a[data-nav="${page}"]`);
    if(link) link.classList.add("active");
  }
  const burger = $(".burger");
  const navlinks = $(".navlinks");
  if(burger && navlinks){
    burger.addEventListener("click", ()=> navlinks.classList.toggle("open"));
  }
  $$(".btn").forEach(btn=>{
    btn.addEventListener("pointermove", (e)=>{
      const r = btn.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      btn.style.setProperty("--mx", mx + "%");
      btn.style.setProperty("--my", my + "%");
    });
  });
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el=>io.observe(el));
})();
