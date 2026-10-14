import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import logoImg from './imagens/lacos maternos imagem.png';
import './App.css';

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function RealTimeMap({ points, activeIndex }) {
  const centerPos = points[activeIndex] ? [points[activeIndex].lat, points[activeIndex].lng] : [-22.8988, -47.0562];

  return (
    <div className="map-container-wrapper">
      <MapContainer 
        center={centerPos} 
        zoom={12} 
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {points.map((point, idx) => (
          <Marker key={idx} position={[point.lat, point.lng]} icon={customIcon}>
            <Popup>
              <div className="popup-content">
                <strong className="popup-title">{point.name}</strong>
                <p className="popup-sub">{point.sub}</p>
                <p className="popup-address">{point.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('bancos');
  const [selectedOption, setSelectedOption] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [selectedCard, setSelectedCard] = useState(0);
  const [searchCity, setSearchCity] = useState('Campinas, SP');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalData, setActiveModalData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [toastMessage, setToastMessage] = useState('');

  const locations = [
    {
      name: 'Banco de Leite Humano - Campinas',
      sub: 'Maternidade de Campinas',
      type: 'Banco de Leite',
      distance: '2,4 km',
      open: true,
      homeCollection: true,
      address: 'Av. Orosimbo Maia, 165 - Vila Itapura, Campinas - SP',
      phone: '(19) 3737-1234',
      hours: '08:00 - 17:00',
      lat: -22.8988,
      lng: -47.0562
    },
    {
      name: 'BLH Centro de Atenção Maternal',
      sub: 'CAISM / Unicamp',
      type: 'Banco de Leite',
      distance: '5,1 km',
      open: true,
      homeCollection: true,
      address: 'Rua Alexander Fleming, 101 - Cidade Universitária, Campinas - SP',
      phone: '(19) 3521-7000',
      hours: '07:30 - 18:00',
      lat: -22.8275,
      lng: -47.0628
    },
    {
      name: 'Posto de Coleta de Leite Humano',
      sub: 'Hospital Celso Pierro (PUC)',
      type: 'Posto de Coleta',
      distance: '8,3 km',
      open: false,
      homeCollection: false,
      address: 'Av. John Boyd Dunlop, s/n - Jd. Ipaussurama, Campinas - SP',
      phone: '(19) 3343-8600',
      hours: '08:00 - 16:00',
      lat: -22.9031,
      lng: -47.1245
    }
  ];

  const filteredLocations = locations.filter((loc) => {
    if (selectedFilter === 'Todos') return true;
    if (selectedFilter === 'Banco de Leite') return loc.type === 'Banco de Leite';
    if (selectedFilter === 'Posto de Coleta') return loc.type === 'Posto de Coleta';
    if (selectedFilter === 'Coleta Domiciliar') return loc.homeCollection;
    if (selectedFilter === 'Aberto Agora') return loc.open;
    return true;
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleOpenDetails = (loc) => {
    setActiveModalData(loc);
    setIsModalOpen(true);
  };

  const handleContact = (loc) => {
    if (loc.phone) {
      window.open(`tel:${loc.phone.replace(/\D/g, '')}`);
    } else {
      showToast('Telefone indisponível no momento.');
    }
  };

  const handleDownloadPDF = () => {
    showToast('Gerando e baixando comprovante em PDF...');
  };

  return (
    <div className="app-container">
      {toastMessage && (
        <div className="toast">
          {toastMessage}
        </div>
      )}

      {isModalOpen && activeModalData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{activeModalData.name}</h2>
            <p className="modal-subtitle">{activeModalData.sub}</p>
            <hr className="modal-divider" />
            <p className="modal-info"><strong>Endereço:</strong> {activeModalData.address}</p>
            <p className="modal-info"><strong>Telefone:</strong> {activeModalData.phone || 'Não informado'}</p>
            <p className="modal-info"><strong>Horário:</strong> {activeModalData.hours}</p>
            <p className="modal-info"><strong>Coleta Domiciliar:</strong> {activeModalData.homeCollection ? 'Sim' : 'Não'}</p>
            <div className="modal-actions">
              <button onClick={() => handleContact(activeModalData)} className="btn-modal-primary">Ligar Agora</button>
              <button onClick={() => setIsModalOpen(false)} className="btn-modal-secondary">Fechar</button>
            </div>
          </div>
        </div>
      )}

      <header className="header">
        <div onClick={() => setCurrentPage('inicio')} className="logo-container">
          <img src={logoImg} alt="Laços Maternos" className="logo-img" />
        </div>

        <nav className="nav-menu">
          <button onClick={() => setCurrentPage('inicio')} className={`nav-link ${currentPage === 'inicio' ? 'active' : ''}`}>Início</button>
          <button onClick={() => setCurrentPage('porque')} className={`nav-link ${currentPage === 'porque' ? 'active' : ''}`}>Por que doar</button>
          <button onClick={() => setCurrentPage('triagem')} className={`nav-link ${currentPage === 'triagem' ? 'active' : ''}`}>Como funciona</button>
          <button onClick={() => setCurrentPage('bancos')} className={`nav-link ${currentPage === 'bancos' ? 'active' : ''}`}>Bancos de Leite</button