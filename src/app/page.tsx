
'use client';

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deliveries } from "@/lib/data";
import MapPlaceholder from "@/components/dashboard/map-placeholder";
import { DollarSign, Package, Clock, PackageCheck } from "lucide-react";
import NewRunCard from "@/components/dashboard/new-run-card";
import type { Delivery } from "@/lib/types";
import OrderCard from "@/components/dashboard/order-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const newDeliveryMock: Delivery = {
  id: 'NEW-009',
  customerName: 'Mariana Oliveira',
  address: 'Rua Haddock Lobo, 595, São Paulo, SP',
  restaurant: 'Fast Vegan',
  status: 'pending',
  deadline: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  earnings: 9.50,
};


export default function DashboardPage() {
  const [isOnline, setIsOnline] = useState(false);
  const [activeDeliveries, setActiveDeliveries] = useState(deliveries.filter(d => d.status === 'in_transit' || d.status === 'pending'));
  const [completedDeliveries, setCompletedDeliveries] = useState(deliveries.filter(d => d.status === 'delivered'));
  const [showNewRun, setShowNewRun] = useState(false);
  const [onlineTime, setOnlineTime] = useState(0);

  const todaysCompleted = completedDeliveries.filter(d => d.deliveryTime && new Date(d.deliveryTime).toDateString() === new Date().toDateString());
  const todaysEarnings = todaysCompleted.reduce((acc, d) => acc + d.earnings, 0);

  useEffect(() => {
    let newRunTimeout: NodeJS.Timeout;
    if (isOnline) {
      newRunTimeout = setTimeout(() => {
        setShowNewRun(true);
      }, 8000); // Show new run after 8 seconds of being online
    } else {
      setShowNewRun(false);
    }
    return () => clearTimeout(newRunTimeout);
  }, [isOnline]);

   useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOnline) {
      interval = setInterval(() => {
        setOnlineTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOnline]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleAcceptRun = () => {
    setActiveDeliveries(prev => [newDeliveryMock, ...prev]);
    setShowNewRun(false);
  };

  const handleDeclineRun = () => {
    setShowNewRun(false);
  };
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary">Painel de Corridas</h1>
        <div className="flex items-center space-x-2 bg-card p-3 rounded-lg border">
          <Switch id="online-status" checked={isOnline} onCheckedChange={setIsOnline} />
          <Label htmlFor="online-status" className={`font-bold ${isOnline ? 'text-primary' : 'text-muted-foreground'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </Label>
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-body">Ganhos do Dia</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">
              {todaysEarnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">Ganhos de hoje.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-body">Entregas do Dia</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{todaysCompleted.length}</div>
            <p className="text-xs text-muted-foreground">Corridas finalizadas hoje.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-body">Tempo Online</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{formatTime(onlineTime)}</div>
            <p className="text-xs text-muted-foreground">Tempo total disponível hoje.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           {showNewRun ? (
             <NewRunCard delivery={newDeliveryMock} onAccept={handleAcceptRun} onDecline={handleDeclineRun} />
           ) : (
            <MapPlaceholder />
           )}
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Package className="text-primary" />
              Entregas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeDeliveries.length > 0 ? (
                activeDeliveries.slice(0, 3).map(delivery => (
                  <OrderCard key={delivery.id} delivery={delivery} />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">Nenhuma entrega ativa no momento.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Histórico de Entregas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="active">Ativas</TabsTrigger>
              <TabsTrigger value="completed">Concluídas</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {activeDeliveries.length > 0 ? (
                  activeDeliveries.map(delivery => (
                    <OrderCard key={delivery.id} delivery={delivery} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm p-4">Nenhuma entrega ativa.</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {completedDeliveries.length > 0 ? (
                  completedDeliveries.map(delivery => (
                    <OrderCard key={delivery.id} delivery={delivery} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm p-4">Nenhuma entrega concluída ainda.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

    