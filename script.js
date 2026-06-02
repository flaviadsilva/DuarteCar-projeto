// Config
const PHONE = '555192148142'; // formato para wa.me — (55)(51)92148142
const ADDRESS = 'Av. Jose Joaquim, 142, Sapucaia do Sul, RS, Brasil';

function openWhatsApp(message){
  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// Top header button
document.addEventListener('DOMContentLoaded',()=>{
  const topBtn = document.getElementById('whatsapp-top');
  const heroBtn = document.getElementById('whatsapp-hero');
  const contactBtn = document.getElementById('whatsapp-contact');
  const mapsHero = document.getElementById('maps-hero');
  const mapsRoute = document.getElementById('maps-route');

  const defaultMsg = 'Olá Duarte Car, gostaria de atendimento e orçamento.';

  [topBtn, heroBtn, contactBtn].forEach(btn=>{
    if(!btn) return;
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      openWhatsApp(defaultMsg);
    });
  });

  // Maps links
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`;
  if(mapsHero) mapsHero.setAttribute('href', mapsUrl);
  if(mapsRoute) mapsRoute.setAttribute('href', mapsUrl);

  // Service quote links
  document.querySelectorAll('.quote-link').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const svc = a.dataset.service || 'Orçamento';
      openWhatsApp(`Olá Duarte Car, gostaria de orçamento para: ${svc}`);
    });
  });
});
