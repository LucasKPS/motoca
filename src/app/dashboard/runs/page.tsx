'use client';

import { useState, useMemo } from 'react';
import NewRunCard from '@/components/dashboard/new-run-card';
import OrderCard from '@/components/dashboard/order-card';
import MapPlaceholder from '@/components/dashboard/map-placeholder';
import type { Delivery } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, History, List, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface RunsPageProps {
    deliveries?: Delivery[];
    handleConfirmDelivery?: (deliveryId: string) => void;
    newDeliveryOffer?: Delivery | null;
    showNewRun?: boolean;
    onAcceptRun?: () => void;
    onDeclineRun?: () => void;
    onShowNewRun?: () => void;
}

export default function RunsPage({ 
    deliveries = [], 
    handleConfirmDelivery = () => {}, 
    newDeliveryOffer = null,
    showNewRun = false,
    onAcceptRun = () => {},
    onDeclineRun = () => {},
    onShowNewRun = () => {},
}: RunsPageProps) {
  
  const activeDeliveries = deliveries.filter(d => d.status === 'in_transit' || d.status === 'pending');
  const historicDeliveries = deliveries.filter(d => d.status === 'delivered' || d.status === 'cancelled');

  return (
    <div className="flex flex-col gap-6 p-1 container">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
            <Rocket />
            Corridas
        </h1>
        <Button onClick={onShowNewRun} disabled={showNewRun}>Simular Nova Corrida</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapPlaceholder />
        </div>

        <div className="lg:col-span-1">
          {showNewRun && newDeliveryOffer ? (
            <NewRunCard 
              delivery={newDeliveryOffer} 
              onAccept={onAcceptRun} 
              onDecline={onDeclineRun} 
            />
          ) : (
             <Card className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/30 border-dashed">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="font-headline text-xl font-semibold">Tudo Certo!</h3>
                <p className="text-muted-foreground">Você está em dia. Nenhuma nova corrida no momento. Avisaremos assim que uma aparecer!</p>
             </Card>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      <div>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
                <List className="mr-2" />
                Ativas ({activeDeliveries.length})
            </TabsTrigger>
            <TabsTrigger value="historic">
                <History className="mr-2" />
                Histórico ({historicDeliveries.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            {activeDeliveries.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
                    {activeDeliveries.map((delivery) => (
                        <OrderCard key={delivery.id} delivery={delivery} onConfirmDelivery={handleConfirmDelivery} />
                    ))}
                 </div>
            ): (
                <Alert className="mt-4 text-center">
                    <Rocket className="w-4 h-4" />
                    <AlertTitle>Nenhuma corrida ativa</AlertTitle>
                    <AlertDescription>
                        Fique online para receber novas oportunidades de entrega.
                    </AlertDescription>
                </Alert>
            )}
           </TabsContent>
           <TabsContent value="historic">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
                {historicDeliveries.map((delivery) => (
                    <OrderCard key={delivery.id} delivery={delivery} />
                ))}
             </div>
           </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
