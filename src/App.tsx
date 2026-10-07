import React, { useState } from 'react';
import { Header } from './components/Header';
import { BusSearchControls } from './components/BusSearchControls';
import { BusHeroCard } from './components/BusHeroCard';
import { LiveBusRadarMap } from './components/LiveBusRadarMap';
import { AdjacentStops } from './components/AdjacentStops';
import { CommuterAdvisory } from './components/CommuterAdvisory';
import { TransitFooter } from './components/TransitFooter';
import { RouteDirectoryModal } from './components/RouteDirectoryModal';
import { TransitAlertsModal } from './components/TransitAlertsModal';
import { StopSearchModal } from './components/StopSearchModal';
import { BUS_SERVICES, ADJACENT_STOPS, TRANSIT_ALERTS } from './data/transitData';
import { AdjacentStop } from './types/transit';

export default function App() {
  // Service & navigation states
  const [currentServiceNo, setCurrentServiceNo] = useState<string>('147');
  const [selectedDirection, setSelectedDirection] = useState<number>(0);
  const [selectedHub, setSelectedHub] = useState<string>('Toa Payoh / Jurong East');
  const [activeTab, setActiveTab] = useState<'live' | 'directory' | 'favorites' | 'alerts'>('live');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [bookmarkedServices, setBookmarkedServices] = useState<string[]>(['147']);

  // Modals
  const [directoryModalOpen, setDirectoryModalOpen] = useState(false);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const currentService = BUS_SERVICES[currentServiceNo] || BUS_SERVICES['147'];

  // Handle bookmark toggle
  const toggleBookmark = (serviceNo: string) => {
    setBookmarkedServices((prev) =>
      prev.includes(serviceNo) ? prev.filter((s) => s !== serviceNo) : [...prev, serviceNo]
    );
  };

  // GPS Locate simulator
  const handleGpsLocate = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setCurrentServiceNo('147');
    }, 900);
  };

  const handleSelectAdjacentStop = (stop: AdjacentStop) => {
    if (stop.buses.length > 0 && BUS_SERVICES[stop.buses[0]]) {
      setCurrentServiceNo(stop.buses[0]);
    }
  };

  const handleTabChange = (tab: 'live' | 'directory' | 'favorites' | 'alerts') => {
    setActiveTab(tab);
    if (tab === 'directory') setDirectoryModalOpen(true);
    if (tab === 'alerts') setAlertsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF] bg-grid-dots">
      {/* 1. Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        selectedHub={selectedHub}
        setSelectedHub={setSelectedHub}
        onOpenSearch={() => setSearchModalOpen(true)}
        favoritesCount={bookmarkedServices.length}
        alertCount={TRANSIT_ALERTS.length}
      />

      {/* 2. Main Transit Viewport */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-3 sm:px-6 py-5">
        <div className="space-y-4 bg-[#0E121B]/90 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl">
          {/* Search & Top Controls */}
          <BusSearchControls
            currentService={currentService}
            onSelectService={(no) => setCurrentServiceNo(no)}
            selectedDirection={selectedDirection}
            onSelectDirection={setSelectedDirection}
            onGpsLocate={handleGpsLocate}
            isLocating={isLocating}
          />

          {/* Main Transit Grid: Bus Hero Card (Left) & Radar Map (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start pt-2">
            {/* Left Card: Bus 147 Details & Corridor Progress */}
            <BusHeroCard
              service={currentService}
              isBookmarked={bookmarkedServices.includes(currentService.serviceNo)}
              onToggleBookmark={() => toggleBookmark(currentService.serviceNo)}
              onSelectStop={() => setSearchModalOpen(true)}
            />

            {/* Right Card: Live Bus Radar Map */}
            <LiveBusRadarMap
              service={currentService}
              onOpenAlerts={() => setAlertsModalOpen(true)}
              onSelectStop={() => setSearchModalOpen(true)}
            />
          </div>

          {/* Alternative Adjacent Bus Stops */}
          <div className="pt-2">
            <AdjacentStops
              stops={ADJACENT_STOPS}
              onSelectAdjacentStop={handleSelectAdjacentStop}
              onSelectBus={(bus) => setCurrentServiceNo(bus)}
            />
          </div>

          {/* LTA Commuter Advisory */}
          <div className="pt-1">
            <CommuterAdvisory />
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <TransitFooter
        onOpenAlerts={() => setAlertsModalOpen(true)}
        onOpenDirectory={() => setDirectoryModalOpen(true)}
      />

      {/* Modals */}
      {directoryModalOpen && (
        <RouteDirectoryModal
          service={currentService}
          onClose={() => {
            setDirectoryModalOpen(false);
            if (activeTab === 'directory') setActiveTab('live');
          }}
          onSelectService={(no) => setCurrentServiceNo(no)}
          allServices={BUS_SERVICES}
        />
      )}

      {alertsModalOpen && (
        <TransitAlertsModal
          onClose={() => {
            setAlertsModalOpen(false);
            if (activeTab === 'alerts') setActiveTab('live');
          }}
        />
      )}

      {searchModalOpen && (
        <StopSearchModal
          onClose={() => setSearchModalOpen(false)}
          onSelectBus={(no) => setCurrentServiceNo(no)}
          allServices={BUS_SERVICES}
        />
      )}
    </div>
  );
}
