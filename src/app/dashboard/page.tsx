"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const [vencedor, setVencedor] = useState<string | null>(null);
  const pilotos = ["João", "Maria", "Carlos", "Ana"];

  function simularCorrida() {
    const sorteado = pilotos[Math.floor(Math.random() * pilotos.length)];
    setVencedor(sorteado);
    setShowModal(true);
  }

  function fecharModal() {
    setShowModal(false);
    setVencedor(null);
  }

  return (
    <div>
      {/* ...seu dashboard existente... */}

      {/* Botão para simular corrida */}
      <div className="flex justify-end mt-4">
        <button
          onClick={simularCorrida}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Simular Nova Corrida
        </button>
      </div>

      {/* Modal Pop-up */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[350px] relative">
            <button
              onClick={fecharModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Pedido iFood Simulado
            </h2>
            <div className="mb-2">
              <span className="font-semibold">Restaurante:</span> Pizza Express
            </div>
            <div className="mb-2">
              <span className="font-semibold">Prato:</span> Pizza Calabresa
            </div>
            <div className="mb-2">
              <span className="font-semibold">Entregador:</span> {vencedor}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Status:</span> Pedido a caminho!
            </div>
            <button
              onClick={fecharModal}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* ...restante do dashboard... */}
    </div>
  );
}
