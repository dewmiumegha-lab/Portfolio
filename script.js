// STARS — disabled

// CURSOR
(function(){
  const cur=document.getElementById('cursor'),trail=document.getElementById('cursor-trail');
  if(!cur||!trail)return;
  let mx=0,my=0,tx=0,ty=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
  (function anim(){tx+=(mx-tx)*.12;ty+=(my-ty)*.12;trail.style.left=tx+'px';trail.style.top=ty+'px';requestAnimationFrame(anim);})();
})();

// YEAR
const yearEl=document.getElementById('year');
if(yearEl)yearEl.textContent=new Date().getFullYear();

// REVEAL
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');e.target.classList.add('is-visible');}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// NAV ACTIVE (index only)
const secs=document.querySelectorAll('section[id]'),navAs=document.querySelectorAll('.nav-links a');
if(secs.length>0&&navAs.length>0){
  const secObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const id=e.target.id;navAs.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));}}),{rootMargin:'-35% 0px -55% 0px',threshold:.01});
  secs.forEach(s=>secObs.observe(s));
}

// MOBILE MENU
const toggle=document.querySelector('.menu-toggle'),navEl=document.querySelector('.nav-links');
if(toggle&&navEl){
  toggle.addEventListener('click',()=>{const o=navEl.classList.toggle('open');toggle.setAttribute('aria-expanded',String(o));});
  navEl.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navEl.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));
}

// 3D TILT
document.querySelectorAll('.proj-card,.tl-card,.cert-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(600px) rotateY(${x*8}deg) rotateX(${-y*6}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave',()=>card.style.transform='');
});

// LIGHTBOX
(function(){
  const overlay=document.createElement('div');
  overlay.id='lightbox-overlay';
  overlay.innerHTML='<button id="lb-close">×</button><img id="lb-img" src="" alt="">';
  document.body.appendChild(overlay);
  document.querySelectorAll('.media-block img').forEach(img=>{
    img.addEventListener('click',()=>{document.getElementById('lb-img').src=img.src;overlay.classList.add('active');document.body.style.overflow='hidden';});
  });
  overlay.addEventListener('click',e=>{if(e.target===overlay||e.target.id==='lb-close'){overlay.classList.remove('active');document.body.style.overflow='';}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){overlay.classList.remove('active');document.body.style.overflow='';}});
})();
