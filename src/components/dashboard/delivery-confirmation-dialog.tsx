'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Camera, Loader2, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Delivery } from '@/lib/types';

export function DeliveryConfirmationDialog({ delivery }: { delivery: Delivery }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const { toast } = useToast();

  const handleConfirm = () => {
    if (!photoTaken) {
      toast({
        title: "Foto Necessária",
        description: "Por favor, tire uma foto para confirmar a entrega.",
        variant: "destructive",
      });
      return;
    }
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      setIsConfirmed(true);
      toast({
        title: "Entrega Confirmada!",
        description: `A entrega para ${delivery.customerName} foi confirmada com sucesso.`,
      });
    }, 1500);
  };
  
  const handleTakePhoto = () => {
    // Simulate taking a photo
    setPhotoTaken(true);
     toast({
        title: "Foto Capturada!",
        description: `A foto da entrega foi registrada.`,
      });
  }

  const resetState = () => {
    setIsConfirming(false);
    setIsConfirmed(false);
    setPhotoTaken(false);
  }

  return (
    <Dialog onOpenChange={(open) => !open && resetState()}>
      <DialogTrigger asChild>
        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Confirmar Entrega</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {isConfirmed ? (
           <div className="flex flex-col items-center justify-center p-8 text-center">
            <PartyPopper className="w-16 h-16 text-primary mb-4" />
            <h2 className="text-2xl font-bold font-headline mb-2">Entrega Concluída!</h2>
            <p className="text-muted-foreground">Ótimo trabalho! Você finalizou a entrega para {delivery.customerName}.</p>
            <DialogClose asChild>
                <Button className="mt-6 w-full">Fechar</Button>
            </DialogClose>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline">Confirmar Entrega #{delivery.id.split('-')[1]}</DialogTitle>
              <DialogDescription>
                Tire uma foto do pedido no local da entrega para finalizar.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 flex flex-col items-center gap-4">
              <Button variant="outline" size="lg" className="w-full gap-2" onClick={handleTakePhoto} disabled={photoTaken}>
                <Camera className={photoTaken ? 'text-green-500' : ''} />
                {photoTaken ? 'Foto Tirada!' : 'Tirar Foto'}
              </Button>
              <p className="text-xs text-muted-foreground">Data e hora serão registradas automaticamente.</p>
            </div>
            <DialogFooter>
              <Button onClick={handleConfirm} disabled={isConfirming || !photoTaken} className="w-full">
                {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isConfirming ? 'Confirmando...' : 'Confirmar e Finalizar'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
