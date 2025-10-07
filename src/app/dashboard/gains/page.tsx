'use client';

import { useMemo } from "react";
import { Delivery } from "@/lib/types";

export default function GainsPage({ deliveries = [] }: { deliveries?: Delivery[] }) {
  // Filtra entregas finalizadas
  const finishedDeliveries = deliveries.filter(d => d.status === 'delivered');

  // Calcula total de ganhos
  const totalEarnings = useMemo(
    () => finishedDeliveries.reduce((sum, d) => sum + (d.earnings || 0), 0),
    [finishedDeliveries]
  );

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Seus Ganhos</h1>
      <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
        <div className="text-xl font-semibold">
          Total de entregas finalizadas: {finishedDeliveries.length}
        </div>
        <div className="text-xl font-semibold text-green-600">
          Ganhos totais: {totalEarnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Histórico de entregas</h2>
        <ul className="divide-y">
          {finishedDeliveries.map(delivery => (
            <li key={delivery.id} className="py-2 flex justify-between">
              <span>{delivery.restaurant} - {delivery.address}</span>
              <span className="text-green-600">{delivery.earnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}