'use client';

import type { Delivery } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Package, Store, CheckCircle } from "lucide-react";
import { DeliveryConfirmationDialog } from "./delivery-confirmation-dialog";

interface OrderCardProps {
  delivery: Delivery;
  onConfirmDelivery?: (deliveryId: string) => void;
}

const statusMap: Record<Delivery['status'], { label: string; color: "default" | "secondary" | "destructive" | "outline", icon: React.ReactNode }> = {
  pending: { label: 'Pendente', color: 'secondary', icon: <Clock className="w-3 h-3" /> },
  in_transit: { label: 'Em Rota', color: 'default', icon: <Package className="w-3 h-3" /> },
  delivered: { label: 'Entregue', color: 'outline', icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { label: 'Cancelada', color: 'destructive', icon: <CheckCircle className="w-3 h-3" /> },
};

const OrderCard = ({ delivery, onConfirmDelivery }: OrderCardProps) => {
  const statusInfo = statusMap[delivery.status];

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-lg leading-tight">{delivery.customerName}</CardTitle>
          <Badge variant={statusInfo.color} className="flex gap-1 items-center whitespace-nowrap">
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 pt-2 text-foreground">
          <Store className="w-4 h-4 text-muted-foreground" />
          {delivery.restaurant}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{delivery.address}</span>
        </div>
      </CardContent>
      <CardFooter>
        {(delivery.status === 'in_transit' || delivery.status === 'pending') && onConfirmDelivery ? (
          <DeliveryConfirmationDialog delivery={delivery} onConfirmDelivery={onConfirmDelivery} />
        ) : (
          <Button variant="outline" disabled className="w-full">
            Entrega Finalizada
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
