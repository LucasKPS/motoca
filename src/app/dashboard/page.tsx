'use client';
import type { Delivery } from "@/lib/types";

export default function DashboardPage({ deliveries }: { deliveries: Delivery[] }) {
    // No futuro, esta página irá verificar o tipo de usuário (cliente, restaurante, entregador)
    // e renderizar o painel correspondente.
    // Por agora, vamos mostrar uma mensagem genérica.
  return (
    <div>
        <h1 className="text-3xl font-bold font-headline text-primary mb-4">Bem-vindo ao seu Painel!</h1>
        <p className="text-muted-foreground">Esta será a sua central de controle no Rota Expressa.</p>
        <p className="text-muted-foreground mt-2">Funcionalidades específicas para seu perfil (cliente, restaurante ou entregador) aparecerão aqui em breve.</p>
    </div>
  );
}
