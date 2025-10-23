'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';

const MapPlaceholder = () => {
  const mapImage = PlaceHolderImages.find(img => img.id === 'map-placeholder');
  const [locationStatus, setLocationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  const requestLocation = () => {
    setLocationStatus('pending');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('success');
        toast({
          title: 'Localização Ativada',
          description: 'O mapa agora está centralizado na sua localização.',
        });
      },
      (error) => {
        let errorMessage = 'Ocorreu um erro desconhecido ao tentar obter sua localização.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão para acessar a localização foi negada. Por favor, habilite nas configurações do seu navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Sua localização não está disponível no momento. Tente novamente mais tarde.';
            break;
          case error.TIMEOUT:
            errorMessage = 'A solicitação de localização demorou muito para responder. Tente novamente.';
            break;
        }

        console.error(`Geolocation Error (Code ${error.code}): ${error.message}`);

        setLocationStatus('error');
        toast({
          variant: 'destructive',
          title: 'Falha ao Obter Localização',
          description: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // Adicionado timeout de 10 segundos
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  // ... (restante do código JSX permanece o mesmo)
  // O código JSX será incluído na resposta completa para garantir a integridade do arquivo.

    return (
        <Card className="h-full w-full shadow-lg relative overflow-hidden rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between z-10 absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4">
                <CardTitle className="text-white text-2xl font-bold">Sua Localização</CardTitle>
                {locationStatus === 'error' && (
                    <Button variant="outline" size="sm" onClick={requestLocation} className="bg-white/90 text-gray-800 hover:bg-white">
                        <RefreshCw className="w-4 h-4 mr-2"/>
                        Tentar Novamente
                    </Button>
                )}
            </CardHeader>

            <CardContent className="p-0 h-full w-full flex items-center justify-center">
                {locationStatus === 'pending' && (
                    <div className="flex flex-col items-center justify-center text-center p-4 z-10 bg-black/30 absolute inset-0 text-white">
                        <Loader2 className="animate-spin w-12 h-12 mb-4" />
                        <p className="text-xl font-semibold">Obtendo sua localização...</p>
                        <p className="text-sm text-gray-200">Por favor, autorize o acesso no seu navegador.</p>
                    </div>
                )}

                {locationStatus === 'error' && (
                    <div className="flex flex-col items-center justify-center text-center p-4 z-10 bg-red-900/50 absolute inset-0 text-white">
                        <AlertTriangle className="w-12 h-12 mb-4 text-red-300" />
                        <p className="text-xl font-semibold">Não foi possível obter a localização</p>
                        <p className="text-sm text-gray-200 mt-1">Clique em "Tentar Novamente" ou verifique as permissões.</p>
                    </div>
                )}

                {locationStatus === 'success' && position && (
                     <div className="flex flex-col items-center justify-center text-center p-4 z-10 bg-green-900/50 absolute inset-0 text-white">
                        <MapPin className="w-12 h-12 mb-4 text-green-300" />
                        <p className="text-xl font-semibold">Localização Obtida com Sucesso!</p>
                        <p className="text-sm font-mono bg-white/10 px-2 py-1 rounded mt-2">
                            Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
                        </p>
                    </div>
                )}

                {mapImage && (
                    <Image
                        src={mapImage.src}
                        alt={mapImage.alt}
                        fill
                        className={`object-cover transition-filter duration-500 ${locationStatus !== 'pending' ? 'blur-sm' : ''}`}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default MapPlaceholder;
