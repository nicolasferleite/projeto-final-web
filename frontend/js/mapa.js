
mapboxgl.accessToken = 'pk.eyJ1IjoiZXZpbGF2YXNjb25jZWxvcyIsImEiOiJjbTdncTY2djgxMWoxMmpva3J4czFqdGFsIn0.mxa0lawd98zjJj1NyFwpUw';

function initMap() {
  try {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-39.0186, -4.9783], 
      zoom: 13
    });

   
    map.addControl(new mapboxgl.NavigationControl());


    addMarkers(map);

  } catch (error) {
    console.error('Erro ao carregar o mapa:', error);
    alert('Falha ao carregar o mapa. Verifique o console para detalhes.');
  }
}

function addMarkers(map) {
    const pontosDeColeta = [
      { 
        lng: -39.0186, 
        lat: -4.9783, 
        title: 'Centro de Quixadá', 
        description: 'Ponto de coleta de recicláveis' 
      },
      { 
        lng: -39.0200, 
        lat: -4.9800, 
        title: 'Ponto de Reciclagem', 
        description: 'Coleta de plástico e vidro' 
      },
      { 
        lng: -39.0150, 
        lat: -4.9720, 
        title: 'Avenida José de Queiroz', 
        description: 'Eletrônicos e pilhas' 
      },
      { 
        lng: -39.0250, 
        lat: -4.9850, 
        title: 'Bairro Planalto', 
        description: 'Resíduos orgânicos e plástico' 
      },
      { 
        lng: -39.0123, 
        lat: -4.9690, 
        title: 'Campus do IFCE', 
        description: 'Posto de coleta universitário' 
      }
    ];
  

  pontosDeColeta.forEach(ponto => {
    const marker = new mapboxgl.Marker({ color: '#4CAF50' })
      .setLngLat([ponto.lng, ponto.lat])
      .setPopup(new mapboxgl.Popup().setHTML(`
        <h3>${ponto.title}</h3>
        <p>${ponto.description}</p>
      `))
      .addTo(map);
  });
}

document.addEventListener('DOMContentLoaded', initMap);