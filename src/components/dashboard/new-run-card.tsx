import type { Delivery } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Store, ArrowRight, X, Check, BellRing, DollarSign } from "lucide-react";

interface NewRunCardProps {
  delivery: Delivery;
  onAccept: () => void;
  onDecline: () => void;
}

const NewRunCard = ({ delivery, onAccept, onDecline }: NewRunCardProps) => {

  return (
    <Card className="border-primary border-2 shadow-2xl animate-pulse-slow">
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="font-headline text-2xl flex items-center gap-2 text-primary">
                    <BellRing className="animate-tada" />
                    Nova Corrida!
                </CardTitle>
                <div className="font-bold text-lg font-headline">
                    {delivery.earnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
            </div>
            <CardDescription>Você tem 30 segundos para aceitar.</CardDescription>
        </CardHeader>
      <CardContent className="space-y-3">
         <div className="p-3 rounded-md border bg-card/50">
             <p className="flex items-center gap-2 text-sm font-semibold">
                <Store className="w-4 h-4 text-muted-foreground" />
                Coleta:
            </p>
             <p className="pl-6">{delivery.restaurant}</p>
        </div>
        
        <div className="p-3 rounded-md border bg-card/50">
            <p className="flex items-start gap-2 text-sm font-semibold">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
            Entrega:
            </p>
            <p className="pl-6">{delivery.address}</p>
        </div>
        
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-4">
        <Button variant="destructive" size="lg" onClick={onDecline}>
          <X className="mr-2" />
          Recusar
        </Button>
        <Button variant="default" size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={onAccept}>
          <Check className="mr-2" />
          Aceitar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewRunCard;


