/**
 * Give&Go - Módulo de Creación de Eventos (HU 013)
 * React Web implementation following Give&Go Design Guidelines
 */

import React, { useState } from 'react';
import { CreateEventScreen } from './screens/CreateEventScreen';
import { OrgDashboardScreen } from './screens/OrgDashboardScreen';
import { MyEventsScreen } from './screens/MyEventsScreen';
import { EventDetailScreen } from './screens/EventDetailScreen';
import { BottomTabs, TabType } from './components/common/BottomTabs';
import { EventItem } from './types/event';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('create-event'); // Default view HU 013
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  const handleNavigateToDetail = (event: EventItem) => {
    setSelectedEvent(event);
    setCurrentTab('my-events'); // Keep tab active or show detail view
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans antialiased">
      {/* Dev Bar for switching Frame Mode (Mobile / Full Desktop) */}
      <div className="bg-gray-900 text-gray-300 text-xs py-1.5 px-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-white">Give&Go - HU 013 (Crear Evento)</span>
          <span className="hidden sm:inline text-gray-400">| Expo SDK 54 Design System</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors font-medium cursor-pointer"
            title="Alternar vista de dispositivo móvil"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-red-400" />
                <span>Vista Completa</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-red-400" />
                <span>Simular Móvil</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container Wrapper */}
      <div className={`transition-all duration-300 ${isMobileFrame ? 'max-w-md mx-auto my-6 bg-white rounded-3xl shadow-2xl border-8 border-gray-900 overflow-hidden min-h-[800px] relative' : 'w-full'}`}>
        
        {/* Render active screen */}
        {selectedEvent ? (
          <EventDetailScreen
            event={selectedEvent}
            onNavigateToMyEvents={() => setSelectedEvent(null)}
            onNavigateToDashboard={() => {
              setSelectedEvent(null);
              setCurrentTab('dashboard');
            }}
            onNavigateToCreateEvent={() => {
              setSelectedEvent(null);
              setCurrentTab('create-event');
            }}
          />
        ) : (
          <>
            {currentTab === 'create-event' && (
              <CreateEventScreen
                onNavigateToDashboard={() => setCurrentTab('dashboard')}
                onNavigateToMyEvents={() => setCurrentTab('my-events')}
                onNavigateToDetail={(event) => {
                  setSelectedEvent(event);
                }}
              />
            )}

            {currentTab === 'dashboard' && (
              <OrgDashboardScreen
                onNavigateToCreateEvent={() => setCurrentTab('create-event')}
                onNavigateToMyEvents={() => setCurrentTab('my-events')}
                onNavigateToDetail={(event) => {
                  setSelectedEvent(event);
                }}
              />
            )}

            {currentTab === 'my-events' && (
              <MyEventsScreen
                onNavigateToCreateEvent={() => setCurrentTab('create-event')}
                onNavigateToDashboard={() => setCurrentTab('dashboard')}
                onNavigateToDetail={(event) => {
                  setSelectedEvent(event);
                }}
              />
            )}
          </>
        )}

        {/* Bottom Navigation Tabs */}
        <BottomTabs
          activeTab={currentTab}
          onTabChange={(tab) => {
            setSelectedEvent(null);
            setCurrentTab(tab);
          }}
        />
      </div>
    </div>
  );
}
