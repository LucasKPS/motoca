"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons';
import { ArrowRight, ShoppingCart, CookingPot, Bike, X } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [vencedor, setVencedor] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const pilotos = ['João', 'Maria', 'Carlos', 'Ana']; // Altere conforme necessário

  function simularCorrida() {
    console.log('Simulando corrida...');
    const sorteado = pilotos[Math.floor(Math.random() * pilotos.length)];
    setVencedor(sorteado);
    setShowModal(true);
  }

  function fecharModal() {
    setShowModal(false);
    setVencedor(null);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <span className="text-xl font-headline font-semibold text-foreground">Rota Expressa</span>
        </div>
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Criar Conta</Link>
            </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary">
          Sua fome, nossa missão.
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
          Conectamos você aos melhores restaurantes da cidade, com entregas rápidas e eficientes. A solução completa para clientes, restaurantes e entregadores.
        </p>
      </main>

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
            <h2 className="text-2xl font-bold mb-4 text-red-600">Pedido iFood Simulado</h2>
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

      <section className="bg-secondary/50 py-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <Card className="bg-transparent shadow-none border-none">
            <CardHeader className="items-center">
               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
              <CardTitle className="font-headline text-2xl">
                Para Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-muted-foreground">Encontre seus pratos favoritos, explore novos sabores e receba tudo no conforto da sua casa.</p>
                <Button asChild variant="link" className="text-primary">
                    <Link href="/signup?role=client">Comece a pedir <ArrowRight className="ml-2" /></Link>
                </Button>
            </CardContent>
          </Card>
          <Card className="bg-transparent shadow-none border-none">
            <CardHeader className="items-center">
                 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <CookingPot className="h-8 w-8 text-primary" />
                </div>
              <CardTitle className="font-headline text-2xl">
                Para Restaurantes
              </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-muted-foreground">Alcance mais clientes, gerencie seus pedidos de forma simples e veja seu negócio crescer.</p>
                 <Button asChild variant="link" className="text-primary">
                    <Link href="/signup?role=merchant">Seja um parceiro <ArrowRight className="ml-2" /></Link>
                </Button>
            </CardContent>
          </Card>
          <Card className="bg-transparent shadow-none border-none">
            <CardHeader className="items-center">
                 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Bike className="h-8 w-8 text-primary" />
                </div>
              <CardTitle className="font-headline text-2xl">
                Para Entregadores
              </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-muted-foreground">Tenha flexibilidade, ganhe uma renda extra e faça parte de uma rede de entregas eficiente.</p>
                 <Button asChild variant="link" className="text-primary">
                    <Link href="/signup?role=courier">Faça entregas <ArrowRight className="ml-2" /></Link>
                </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="container mx-auto text-center py-6 text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Rota Expressa. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
