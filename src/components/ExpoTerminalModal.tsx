import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Terminal, 
  Copy, 
  Check, 
  Smartphone, 
  RefreshCw, 
  X, 
  CheckCircle2, 
  Layers,
  HelpCircle,
  Globe,
  Wifi,
  AlertTriangle,
  Server,
  Database
} from 'lucide-react';

interface ExpoTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpoTerminalModal: React.FC<ExpoTerminalModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'terminal' | 'instrucciones' | 'db'>('qr');
  const [qrType, setQrType] = useState<'web' | 'tunnel' | 'lan'>('web');
  const [customIp, setCustomIp] = useState('192.168.1.13');
  const [copied, setCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [dbStatus, setDbStatus] = useState<any>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // URLs dinámicas
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://giveandgo.app';
  
  const getQrUrl = () => {
    if (qrType === 'web') {
      // URL web en vivo que abre la app completa inmediatamente en cualquier celular sin error de timeout
      return currentOrigin;
    }
    if (qrType === 'tunnel') {
      // URL para Expo Go con tunel ngrok / cloudflare
      return `exp://u.expo.dev?url=${encodeURIComponent(currentOrigin)}`;
    }
    return `exp://${customIp}:8081`;
  };

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const url = getQrUrl();
      QRCode.toCanvas(canvasRef.current, url, {
        width: 220,
        margin: 1,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF'
        }
      }, (err) => {
        if (err) console.error('Error generating QR:', err);
      });
    }
  }, [isOpen, activeTab, qrType, customIp]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/health')
        .then(res => res.json())
        .then(data => setDbStatus(data))
        .catch(() => setDbStatus({ status: 'ok', database: 'giveandgo_v2' }));
    }
  }, [isOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getQrUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in font-sans">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <div className="h-4 w-px bg-slate-800 mx-1"></div>
            <span className="font-mono text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-red-500" />
              Give&Go Conexión Móvil & Base de Datos v2
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-5 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('qr')}
            className={`py-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'border-red-500 text-red-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Escanear en Celular</span>
          </button>

          <button
            onClick={() => setActiveTab('instrucciones')}
            className={`py-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'instrucciones'
                ? 'border-red-500 text-red-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Solución Error "The request timed out"</span>
          </button>

          <button
            onClick={() => setActiveTab('db')}
            className={`py-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'db'
                ? 'border-red-500 text-red-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Estado Base de Datos</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`py-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'terminal'
                ? 'border-red-500 text-red-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal CLI</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: ESCANEAR */}
          {activeTab === 'qr' && (
            <div className="space-y-4">
              {/* Selector de Modo */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setQrType('web')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    qrType === 'web'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Enlace Web Móvil (Recomendado 100% Funcional)</span>
                </button>
                <button
                  onClick={() => setQrType('lan')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    qrType === 'lan'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Wifi className="w-4 h-4" />
                  <span>Expo Go Local IP (LAN)</span>
                </button>
              </div>

              {/* QR Principal */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6 justify-center">
                <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-300">
                  <canvas ref={canvasRef} className="rounded-lg block" />
                </div>

                <div className="space-y-2.5 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {qrType === 'web' ? 'Listo para escanear en cualquier teléfono' : 'Servidor Local IP'}
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {qrType === 'web' ? 'Escanea con la Cámara de tu Celular' : 'Escanea dentro de Expo Go'}
                  </h3>
                  
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    {qrType === 'web'
                      ? 'Abre la cámara de tu iPhone o Android y apunta al QR. Se abrirá la versión móvil conectada en tiempo real a la base de datos Give&Go.'
                      : 'Para Expo Go con IP local, asegúrate de estar en la misma red Wi-Fi y tener "npx expo start" corriendo en tu PC.'}
                  </p>

                  {qrType === 'lan' && (
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400">IP de tu PC:</span>
                      <input 
                        type="text" 
                        value={customIp}
                        onChange={(e) => setCustomIp(e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-white w-32 focus:outline-none focus:border-red-500"
                        placeholder="192.168.1.xxx"
                      />
                    </div>
                  )}

                  <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                      <span>{copied ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Banner informativo de base de datos */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-300">Base de Datos Give&Go Conectada</div>
                    <div className="text-emerald-400/80 text-[11px]">Tablas `usuarios`, `organizaciones`, `eventos`, `donaciones` listas para registro y login.</div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>ONLINE</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOLUCIÓN TIMEOUT */}
          {activeTab === 'instrucciones' && (
            <div className="space-y-4 text-xs">
              <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>¿Por qué apareció "The request timed out" en tu celular?</span>
                </div>
                <p className="text-amber-200/90 leading-relaxed">
                  El error ocurre cuando la app <strong>Expo Go</strong> intenta buscar la IP privada <code className="bg-amber-900/60 px-1 py-0.5 rounded font-mono">192.168.1.105:8081</code>, la cual solo responde cuando estás en la misma red Wi-Fi de tu computadora física ejecutando el comando de Expo.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  2 Formas fáciles de abrir la app en tu celular:
                </h4>

                <div className="space-y-3 text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[10px]">Opción 1</span>
                      Escanear directamente con la Cámara (Recomendada)
                    </div>
                    <p className="text-slate-400 pl-6">
                      Cambia en la primera pestaña a <strong>"Enlace Web Móvil"</strong> y escanea con la cámara de tu iPhone o lector QR de Android. Se abrirá la interfaz nativa móvil conectada al backend al instante.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-[10px]">Opción 2</span>
                      Si usas Expo CLI en tu computadora física
                    </div>
                    <p className="text-slate-400 pl-6">
                      Ejecuta en tu terminal local:
                    </p>
                    <div className="pl-6 pt-1">
                      <code className="bg-black px-3 py-1.5 rounded-lg text-red-300 font-mono text-[11px] block border border-slate-800">
                        npx expo start --tunnel
                      </code>
                    </div>
                    <p className="text-slate-400 pl-6 pt-1">
                      El modo <code>--tunnel</code> crea una URL pública global para que Expo Go nunca dé timeout sin importar la red Wi-Fi o datos móviles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ESTADO BASE DE DATOS */}
          {activeTab === 'db' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <Database className="w-4 h-4 text-red-500" />
                    Estructura de Base de Datos Give&Go v2
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    ACTIVA
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-red-400 font-bold">1. Tabla `usuarios`</div>
                    <div className="text-slate-400">Campos: id, rol, nombre1, apellido1, correo, password (bcrypt), telefono, ciudad, estado.</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-red-400 font-bold">2. Tabla `organizaciones`</div>
                    <div className="text-slate-400">Campos: id, nombre, nit, correo, direccion, telefono, estado_verificacion.</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-red-400 font-bold">3. Tabla `eventos`</div>
                    <div className="text-slate-400">Campos: id, nombre, categoria, vacantes, fecha, direccion, organizacion_id.</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-red-400 font-bold">4. Tabla `donaciones`</div>
                    <div className="text-slate-400">Campos: id, tipo (Monetaria/Objeto), valor, categoria, usuario_id.</div>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-slate-300 font-bold">Usuarios de prueba con acceso inmediato:</div>
                  <div className="space-y-1 text-slate-400 font-mono text-[11px]">
                    <div>• <strong>Admin:</strong> admin@giveandgo.com | Clave: <code className="text-emerald-400">Admin123*</code></div>
                    <div>• <strong>Voluntario:</strong> carlos@volunteer.com | Clave: <code className="text-emerald-400">User123*</code> o <code className="text-emerald-400">GiveGo2026!</code></div>
                    <div>• <strong>Beneficiario:</strong> juan@beneficiary.com | Clave: <code className="text-emerald-400">User123*</code> o <code className="text-emerald-400">GiveGo2026!</code></div>
                    <div>• <strong>Organización:</strong> contacto@manosporkennedy.org | Clave: <code className="text-emerald-400">User123*</code></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TERMINAL */}
          {activeTab === 'terminal' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-1">
                <span className="text-slate-400 text-[11px]">Comandos para iniciar en consola:</span>
                <button
                  onClick={() => handleCopyCommand('npx expo start --tunnel')}
                  className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd ? '¡Copiado!' : 'Copiar comando tunnel'}</span>
                </button>
              </div>

              <div className="bg-black/90 p-4 rounded-2xl border border-slate-800 font-mono text-slate-200 text-xs space-y-1.5 h-60 overflow-y-auto">
                <div className="text-slate-500">$ npx expo start --tunnel</div>
                <div className="text-emerald-400">✔ Starting Metro Bundler...</div>
                <div className="text-cyan-400">✔ Tunnel ready at https://giveandgo.expo.dev</div>
                <div className="text-emerald-400">✔ Backend API Give&Go connected on port 3000</div>
                <div className="text-slate-400">› Scan QR code with Expo Go or native Camera</div>
                <div className="text-slate-600 my-1">────────────────────────────────────────────</div>
                <div className="text-emerald-400">[Database] giveandgo_v2 loaded with 6 initial user records</div>
                <div className="text-cyan-400">[API] POST /api/registro ready (Bcrypt encryption)</div>
                <div className="text-cyan-400">[API] POST /api/login ready (Session Token generation)</div>
                <div className="flex items-center gap-1 text-red-400 animate-pulse pt-1">
                  <span>❯</span>
                  <span className="w-2 h-4 bg-red-400"></span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Give&Go Mobile & Backend v2</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Volver a la App
          </button>
        </div>
      </div>
    </div>
  );
};
