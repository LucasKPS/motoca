'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowRight } from "lucide-react";
import React from 'react';

// O tipo MerchantOrder não é mais necessário para esta versão mínima
// import type { MerchantOrder } from "@/lib/types";


export default function MerchantHome({ name = "Lanchonete XYZ" }: { name?: string, orders?: any[] }) {

  return (
    <div>
        <h1 className="text-3xl font-bold font-headline mb-6">
          Bem-vindo(a), {name}
        </h1>

        <Card className="border-2 border-green-500/50">
            <CardContent className="p-6 flex justify-between items-center">
                <div>
                    <CardTitle className="text-xl text-green-600 mb-1 flex items-center gap-2">
                        <DollarSign className="w-5 h-5" /> Status: Operacional
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">O site está estável. Foco na próxima tarefa.</p>
                </div>
                <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
                    Iniciar Alterações <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}