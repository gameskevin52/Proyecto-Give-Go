import React, { useState } from 'react';
import { MobileWrapper } from './components/MobileWrapper';
import { Inicio } from './components/Inicio';
import { CrearUsuario } from './components/CrearUsuario';
import { IniciarSesion } from './components/IniciarSesion';
import { UsuarioDB } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'inicio' | 'registro' | 'login'>('inicio');
  const [registeredUsers, setRegisteredUsers] = useState<UsuarioDB[]>([]);
  const [currentUser, setCurrentUser] = useState<UsuarioDB | null>(null);

  const handleUsuarioRegistrado = (usuario: UsuarioDB) => {
    setRegisteredUsers(prev => [usuario, ...prev]);
  };

  const handleLoginExitoso = (usuario: UsuarioDB) => {
    setCurrentUser(usuario);
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
        <IniciarSesion
          onVolverInicio={() => setCurrentScreen('inicio')}
          onIrARegistro={() => setCurrentScreen('registro')}
          onLoginExitoso={handleLoginExitoso}
        />
      )}
    </MobileWrapper>
  );
}
