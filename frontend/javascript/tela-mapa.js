

mapboxgl.accessToken = 'pk.eyJ1IjoiZXZpbGF2YXNjb25jZWxvcyIsImEiOiJjbTdncTY2djgxMWoxMmpva3J4czFqdGFsIn0.mxa0lawd98zjJj1NyFwpUw';

let currentUser = null;
let selectedCoords = null;
let map = null;

async function initMap() {
  try {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-39.0186, -4.9783], 
      zoom: 14
    });

    map.addControl(new mapboxgl.NavigationControl());
    setupMapClick(map);
    return map;
  } catch (error) {
    console.error('Erro ao carregar o mapa:', error);
    alert('Falha ao carregar o mapa. Verifique o console para detalhes.');
  }
}

async function checkAdmin() {
  try {
    const token = localStorage.getItem('token');
    console.log('Token JWT:', localStorage.getItem('token'));
    if (!token) {
      console.log('Usuário não está logado.');
      return;
    }

    const response = await axios.get('http://localhost:1337/api/users/me?populate=role', {

      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(response);
    
    if (!response.data) {
      throw new Error('Resposta da API vazia ou inválida.');
    }

    currentUser = response.data;
    console.log('Usuário atual:', currentUser);

    if (currentUser.role.name === 'Administrador') {
      console.log('Usuário é administrador. Exibindo controles.');
      document.querySelector('.admin-controls').style.display = 'block';
      document.getElementById('addPointBtn').addEventListener('click', () => {
        document.getElementById('pointForm').style.display = 'block';
      });
    } else {
      console.log('Usuário não é administrador.');
    }
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    alert('Falha ao verificar permissões. Verifique o console para detalhes.');
  }
}

function setupMapClick(map) {
  map.on('click', (e) => {
    if (currentUser?.role?.name === 'Administrador') {
      selectedCoords = [e.lngLat.lng, e.lngLat.lat];
    }
  });
}

async function addMarkers(map) {
  try {
    document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());

    const response = await axios.get('http://localhost:1337/api/ponto-de-coletas');
    const pontosDeColeta = response.data.data;

    for (const ponto of pontosDeColeta) {
      const markerContainer = document.createElement('div');
      markerContainer.className = 'marker-container';
      

      const marker = new mapboxgl.Marker({ element: markerContainer }) 
        .setLngLat([ponto.longitude, ponto.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <h3>${ponto.nome}</h3>
          <p>${ponto.endereco}</p>
        `))
        .addTo(map);
    }
  } catch (error) {
    console.error('Erro ao carregar pontos:', error);
  }
}

async function createPoint(pointData) {
  try {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:1337/api/ponto-de-coletas',{data:pointData} , {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Ponto criado com sucesso!');
    await addMarkers(map);
  } catch (error) {
    console.error('Erro ao criar ponto:', error);
    alert('Falha ao criar ponto. Verifique o console para detalhes.');
  }
}



document.addEventListener('DOMContentLoaded', async () => {
  await checkAdmin();
  const map = await initMap();
  await addMarkers(map);
});

document.getElementById('savePoint')?.addEventListener('click', async () => {
  const pointData = {
    nome: document.getElementById('title').value,
    endereco: document.getElementById('description').value,
    longitude: selectedCoords[0],
    latitude: selectedCoords[1]
  };
  
  await createPoint(pointData);
});