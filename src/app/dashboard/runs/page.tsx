// src/app/dashboard/runs/page.tsx
'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Rocket, List, History } from "lucide-react";
import OrderCard from "@/components/dashboard/order-card";
import NewRunCard from "@/components/dashboard/new-run-card";
import { useDeliveries } from "../../../hooks/useDeliveries"; 
// Usando 'any' como placeholder
type Delivery = any;

export default function RunsPage({ initialDeliveries = [] }: { initialDeliveries?: Delivery[] }) {
    const { 
        addDelivery, 
        confirmDelivery,
        activeDeliveries, 
        historicDeliveries 
    } = useDeliveries(initialDeliveries);

    const [showNewRun, setShowNewRun] = useState(false);
    const [newDeliveryOffer, setNewDeliveryOffer] = useState(null as Delivery | null); 

    function simularCorrida() {
        const pilotos = ["João", "Maria", "Carlos", "Ana"];
        const sorteado = pilotos[Math.floor(Math.random() * pilotos.length)];
        
        const novaEntrega: Delivery = { 
            id: 'sim-' + Date.now().toString(36),
            status: 'pending',
            restaurant: 'Hamburgueria do Chef',
            dish: 'Entrega Prioritária',
            address: 'Rua das Flores, 45, Rio de Janeiro - RJ',
            customerName: 'Cliente Simulado',
            courier: sorteado,
            createdAt: new Date().toISOString(),
            earnings: parseFloat((Math.random() * (45 - 15) + 15).toFixed(2)), 
        };
        setNewDeliveryOffer(novaEntrega);
        setShowNewRun(true);
    }

    function onAcceptRun() {
        if (newDeliveryOffer) {
            addDelivery({ ...newDeliveryOffer, status: 'in_transit' });
            setShowNewRun(false);
            setNewDeliveryOffer(null);
        }
    }

    function onDeclineRun() {
        setShowNewRun(false);
        setNewDeliveryOffer(null);
    }

    function handleConfirmDelivery(deliveryId: string) {
        confirmDelivery(deliveryId);
    }

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

                {/* ABA DE ATIVAS: Mapeamento de conteúdo */}
                <TabsContent value="active">
                    {activeDeliveries.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
                            {activeDeliveries.map((delivery: any) => ( // Garante que o tipo seja 'any'
                                <OrderCard
                                    key={delivery.id} 
                                    delivery={delivery}
                                    onConfirmDelivery={handleConfirmDelivery}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            Nenhuma corrida ativa
                        </div>
                    )}
                </TabsContent>

                {/* ABA DE HISTÓRICO: Mapeamento de conteúdo */}
                <TabsContent value="historic">
                    {historicDeliveries.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
                            {historicDeliveries.map((delivery: any) => ( // Garante que o tipo seja 'any'
                                <OrderCard key={delivery.id} delivery={delivery} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            Nenhuma entrega finalizada
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}