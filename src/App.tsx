import React, { useState } from 'react';
import { MobileWrapper } from './components/MobileWrapper';
import { Inicio } from './components/Inicio';
import { CrearUsuario } from './components/CrearUsuario';
import { IniciarSesion } from './components/IniciarSesion';
import { CerrarSesion } from './components/CerrarSesion';
import { ExpoTerminalModal } from './components/ExpoTerminalModal';
import { UsuarioDB } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'inicio' | 'registro' | 'login' | 'cerrarSesion'>('inicio');
  const [currentUser, setCurrentUser] = useState<UsuarioDB | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [showExpoModal, setShowExpoModal] = useState<boolean>(false);

  const handleLoginExitoso = (usuario: UsuarioDB, token?: string) => {
    setCurrentUser(usuario);
    if (token) {
      setSessionToken(token);
    }
    setCurrentScreen('login');
  };

  const handleConfirmarLogout = () => {
    setCurrentUser(null);
    setSessionToken(null);
    setCurrentScreen('inicio');
  };

  return (
    <>
      <MobileWrapper
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        currentUser={currentUser}
        onOpenExpoModal={() => setShowExpoModal(true)}
      >
        {currentScreen === 'inicio' && (
          <Inicio
            currentUser={currentUser}
            onIrARegistro={() => setCurrentScreen('registro')}
            onIrAIniciarSesion={() => setCurrentScreen('login')}
            onIrACerrarSesion={() => setCurrentScreen('cerrarSesion')}
          />
        )}

        {currentScreen === 'registro' && (
          <CrearUsuario
            onVolverInicio={() => setCurrentScreen('inicio')}
            onIrAIniciarSesion={() => setCurrentScreen('login')}
            onUsuarioRegistrado={(usuario) => {
              handleLoginExitoso(usuario);
            }}
          />
        )}

        {currentScreen === 'login' && (
          <IniciarSesion
            currentUser={currentUser}
            onVolverInicio={() => setCurrentScreen('inicio')}
            onIrARegistro={() => setCurrentScreen('registro')}
            onLoginExitoso={(usuario, token) => handleLoginExitoso(usuario, token)}
            onIrACerrarSesion={() => setCurrentScreen('cerrarSesion')}
          />
        )}

        {currentScreen === 'cerrarSesion' && (
          <CerrarSesion
            currentUser={currentUser}
            sessionToken={sessionToken}
            onConfirmarLogout={handleConfirmarLogout}
            onCancelar={() => setCurrentScreen(currentUser ? 'login' : 'inicio')}
          />
        )}
      </MobileWrapper>

      {/* Modal Emulador y Terminal Metro Expo Go */}
      <ExpoTerminalModal
        isOpen={showExpoModal}
        onClose={() => setShowExpoModal(false)}
      />
    </>
  );
}
