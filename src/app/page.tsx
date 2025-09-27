import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { deliveries } from "@/lib/data"
import { Delivery } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import OrderCard from "@/components/dashboard/order-card"
import MapPlaceholder from "@/components/dashboard/map-placeholder"
import { Package } from "lucide-react"

export default function DashboardPage() {
  const activeDeliveries = deliveries.filter(d => d.status === 'in_transit' || d.status === 'pending');
  const completedDeliveries = deliveries.filter(d => d.status === 'delivered');

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-headline font-bold text-primary">Painel de Corridas</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapPlaceholder />
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
