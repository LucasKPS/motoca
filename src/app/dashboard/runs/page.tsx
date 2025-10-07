'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Rocket, List, History, X } from "lucide-react";
import OrderCard from "@/components/dashboard/order-card";
import NewRunCard from "@/components/dashboard/new-run-card";
import { Delivery } from "@/lib/types";

export default function RunsPage({ deliveries = [] }: { deliveries?: Delivery[] }) {
  const [simulatedDeliveries, setSimulatedDeliveries] = useState<Delivery[]>([]);
  const [showNewRun, setShowNewRun] = useState(false);
  const [newDeliveryOffer, setNewDeliveryOffer] = useState<Delivery | null>(null);

  function simularCorrida() {
    const pilotos = ["João", "Maria", "Carlos", "Ana"];
    const sorteado = pilotos[Math.floor(Math.random() * pilotos.length)];
    const novaEntrega: Delivery = {
      id: Math.random().toString(36).substring(2, 9),
      status: 'pending',
      restaurant: 'Pizza Express',
      dish: 'Pizza Calabresa',
      address: 'Av. Paulista, 1000, São Paulo - SP',
      customerName: 'Cliente Simulado',
      courier: sorteado,
      createdAt: new Date().toISOString(),
      earnings: 12.5,
    };
    setNewDeliveryOffer(novaEntrega);
    setShowNewRun(true);
  }

  function onAcceptRun() {
    if (newDeliveryOffer) {
      setSimulatedDeliveries([...simulatedDeliveries, { ...newDeliveryOffer, status: 'in_transit' }]);
      setShowNewRun(false);
      setNewDeliveryOffer(null);
    }
  }

  function onDeclineRun() {
    setShowNewRun(false);
    setNewDeliveryOffer(null);
  }

  function handleConfirmDelivery(deliveryId: string) {
    setSimulatedDeliveries(simulatedDeliveries =>
      simulatedDeliveries.map(delivery =>
        delivery.id === deliveryId ? { ...delivery, status: 'delivered' } : delivery
      )
    );
  }

  const allDeliveries = [...deliveries, ...simulatedDeliveries];
  const activeDeliveries = allDeliveries.filter(d => d.status === 'in_transit' || d.status === 'pending');
  const historicDeliveries = allDeliveries.filter(d => d.status === 'delivered' || d.status === 'cancelled');

  return (
    <div className="flex flex-col gap-6 p-1 container">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
          <Rocket />
          Corridas
        </h1>
        <button
          onClick={simularCorrida}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Simular Nova Corrida
        </button>
      </div>

      <Separator className="my-4" />

      {/* Nova corrida simulada */}
      {showNewRun && newDeliveryOffer ? (
        <div className="max-w-md mx-auto mb-6">
          <NewRunCard
            delivery={newDeliveryOffer}
            onAccept={onAcceptRun}
            onDecline={onDeclineRun}
          />
        </div>
      ) : null}

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
            {activeDeliveries.length > 0 ? (
              activeDeliveries.map((delivery) => (
                <OrderCard
                  key={delivery.id}
                  delivery={delivery}
                  onConfirmDelivery={handleConfirmDelivery}
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Nenhuma corrida ativa
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="historic">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
            {historicDeliveries.length > 0 ? (
              historicDeliveries.map((delivery) => (
                <OrderCard key={delivery.id} delivery={delivery} />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Nenhuma entrega finalizada
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
