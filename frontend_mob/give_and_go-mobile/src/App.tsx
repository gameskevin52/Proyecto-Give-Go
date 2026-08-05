import React, { useState } from 'react';
import { MobileWrapper } from './components/MobileWrapper';
import { Inicio } from './components/Inicio';
import { CrearUsuario } from './components/CrearUsuario';
import { PaginaEnBlanco } from './components/PaginaEnBlanco';
import { UsuarioDB } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'inicio' | 'registro' | 'login'>('inicio');
  const [registeredUsers, setRegisteredUsers] = useState<UsuarioDB[]>([]);

  const handleUsuarioRegistrado = (usuario: UsuarioDB) => {
    setRegisteredUsers(prev => [usuario, ...prev]);
  };

  return (
    <MobileWrapper
      currentScreen={currentScreen}
      setCurrentScreen={setCurrentScreen}
    >
      {currentScreen === 'inicio' && (
        <Inicio
          onIrARegistro={() => setCurrentScreen('registro')}
          onIrAIniciarSesion={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'registro' && (
        <CrearUsuario
          onVolverInicio={() => setCurrentScreen('inicio')}
          onIrAIniciarSesion={() => setCurrentScreen('login')}
          onUsuarioRegistrado={handleUsuarioRegistrado}
        />
      )}

      {currentScreen === 'login' && (
        <PaginaEnBlanco
          onVolverInicio={() => setCurrentScreen('inicio')}
        />
      )}
    </MobileWrapper>
  );
}
