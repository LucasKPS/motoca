import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const MapPlaceholder = () => {
  const mapImage = PlaceHolderImages.find(img => img.id === 'map-placeholder');

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <MapPin className="text-primary" />
          Rastreamento em Tempo Real
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full overflow-hidden rounded-lg shadow-inner">
          {mapImage && (
            <Image
              src={mapImage.imageUrl}
              alt={mapImage.description}
              width={1200}
              height={800}
              className="w-full h-full object-cover"
              data-ai-hint={mapImage.imageHint}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapPlaceholder;
