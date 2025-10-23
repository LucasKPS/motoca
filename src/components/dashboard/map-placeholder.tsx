'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, AlertTriangle } from 'lucide-react';
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
          description: 'O rastreamento em tempo real está ativo.',
        });
      },
      (error) => {
        console.error(error);
        setLocationStatus('error');
        toast({
          variant: 'destructive',
          title: 'Acesso à Localização Negado',
          description: 'Por favor, habilite o acesso à localização nas configurações do seu navegador.',
        });
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="text-primary" />
            Rastreamento em Tempo Real
          </div>
           <Button variant="ghost" size="sm" onClick={requestLocation}>Atualizar Local</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full overflow-hidden rounded-lg shadow-inner bg-muted/50 flex items-center justify-center relative">
          {locationStatus === 'pending' && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
              <span>Obtendo sua localização...</span>
              <span className="text-xs text-center max-w-xs">Por favor, permita o acesso à localização quando solicitado pelo navegador.</span>
            </div>
          )}
           {locationStatus === 'error' && (
            <div className="flex flex-col items-center gap-2 text-destructive">
              <AlertTriangle className="h-8 w-8" />
              <span>Falha ao obter localização.</span>
              <Button variant="outline" size="sm" onClick={requestLocation} className="mt-2">
                Tentar Novamente
              </Button>
            </div>
          )}
          {locationStatus === 'success' && mapImage && (
            <>
              <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                fill
                className="w-full h-full object-cover"
                data-ai-hint={mapImage.imageHint}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="relative flex flex-col items-center text-center p-4 rounded-lg">
                    <MapPin className="text-white h-12 w-12 drop-shadow-lg" />
                    <div className="mt-2 bg-black/60 backdrop-blur-sm p-2 rounded-md text-white">
                        <p className="font-bold text-lg">Rastreamento Ativo!</p>
                        {position && (
                            <p className="text-xs font-mono">
                                Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
                            </p>
                        )}
                    </div>
                 </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapPlaceholder;
