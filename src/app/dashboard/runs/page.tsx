'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MerchantOrder } from "@/lib/types"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Bike, CheckCircle, Clock, MapPin, AlertTriangle } from "lucide-react"; 
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


// --- TIPAGEM E CHAVES DE DADOS ---

export type RunStatus = 'new_offer' | 'in_progress' | 'delivered' | 'cancelled';

export interface CourierRun {
    id: string;
    value: number;
    status: RunStatus;
    pickupLocation: string;
    deliveryAddress: string;
    estimatedTime: number; 
    customerName: string;
}

interface NewRunOffer {
    id: string;
    type: string;
    value: number;
    timeToAccept: number;
    pickupLocation: string;
    deliveryAddress: string;
}

const RUNS_STORAGE_KEY = 'courier_runs_motoca';


// --- LÓGICA DE PERSISTÊNCIA (Mantida) ---

const getRunsFromLocalStorage = (): CourierRun[] => {
    if (typeof window !== 'undefined') {
        const storedRuns = localStorage.getItem(RUNS_STORAGE_KEY);
        if (storedRuns) {
            return JSON.parse(storedRuns) as CourierRun[];
        }
    }
    return [];
};

const saveRunsToLocalStorage = (runs: CourierRun[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(RUNS_STORAGE_KEY, JSON.stringify(runs));
    }
};

// Dados de exemplo para a corrida simulada
const simulatedOffer: NewRunOffer = {
    id: `CORRIDA-${Math.floor(Math.random() * 10000)}`,
    type: 'Corrida',
    value: parseFloat((Math.random() * 15 + 10).toFixed(2)),
    timeToAccept: 30,
    pickupLocation: ['Hamburgueria do Chef', 'Mercado Central', 'Farmácia Pague Menos'][Math.floor(Math.random() * 3)],
    deliveryAddress: `Rua das Flores, ${Math.floor(Math.random() * 100)}, Rio de Janeiro - RJ`,
};


// --- COMPONENTE MODAL DE NOVA CORRIDA (Mantido) ---

interface NovaCorridaModalProps {
    order: NewRunOffer;
    onClose: () => void;
    onAccept: (run: NewRunOffer) => void;
}

const NovaCorridaModal: React.FC<NovaCorridaModalProps> = ({ order, onClose, onAccept }) => {
    const [timeLeft, setTimeLeft] = useState(order.timeToAccept);

    useEffect(() => {
        if (timeLeft <= 0) {
            onClose(); 
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onClose]);

    const handleAccept = () => {
        onAccept(order);
    };

    const handleDecline = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-red-500 overflow-hidden"
                style={{ borderColor: '#FF5050', maxWidth: '380px' }}
            >
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <div className="flex items-center">
                        <span className="text-3xl mr-3" style={{ color: '#FF5050' }}>🔔</span>
                        <h3 className="m-0 text-xl font-bold" style={{ color: '#FF5050' }}>Nova Corrida!</h3>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">
                        R$ {order.value.toFixed(2).replace('.', ',')}
                    </span>
                </div>

                <p className="text-sm text-gray-600 text-left px-5 mt-3">
                    Você tem <span className="font-semibold text-red-500">{timeLeft}</span> segundos para aceitar.
                </p>

                <div className="p-5 space-y-3">
                    {/* Cartão de Coleta */}
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center border border-gray-200">
                        <span className="mr-3 text-xl">🏪</span>
                        <div>
                            <p className="m-0 text-xs text-gray-500">Coleta:</p>
                            <p className="m-0 font-bold text-base">{order.pickupLocation}</p>
                        </div>
                    </div>

                    {/* Cartão de Entrega */}
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center border border-gray-200">
                        <span className="mr-3 text-xl">📍</span>
                        <div>
                            <p className="m-0 text-xs text-gray-500">Entrega:</p>
                            <p className="m-0 font-bold text-base">{order.deliveryAddress}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between gap-3 p-5 pt-0">
                    <Button 
                        onClick={handleDecline}
                        variant="destructive"
                        className="flex-1 h-12 text-base font-bold bg-red-600 hover:bg-red-700 rounded-lg"
                    >
                        <span className="mr-2">✕</span> Recusar
                    </Button>
                    <Button 
                        onClick={handleAccept}
                        className="flex-1 h-12 text-base font-bold bg-green-600 hover:bg-green-700 rounded-lg"
                        style={{ backgroundColor: '#28a745' }}
                    >
                        <span className="mr-2">✓</span> Aceitar
                    </Button>
                </div>
            </div>
        </div>
    );
};


// --- COMPONENTE DE LINHA DA CORRIDA (MODIFICADO) ---

const runStatusMap: Record<RunStatus, { label: string; icon: React.ElementType, color: string; bgColor: string }> = {
    new_offer: { label: 'Nova Oferta', icon: Clock, color: 'text-red-600', bgColor: 'bg-red-100' },
    in_progress: { label: 'Em Andamento', icon: Bike, color: 'text-amber-600', bgColor: 'bg-amber-100' },
    delivered: { label: 'Concluída', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
    cancelled: { label: 'Cancelada', icon: AlertTriangle, color: 'text-gray-600', bgColor: 'bg-gray-100' },
};

interface RunRowProps {
    run: CourierRun;
    onComplete: (runId: string) => void; // Nova prop para finalizar
}

const RunRow: React.FC<RunRowProps> = ({ run, onComplete }) => {
    const statusInfo = runStatusMap[run.status];
    
    // Função local para o botão "Entregue"
    const handleComplete = () => {
        if (window.confirm(`Tem certeza que deseja marcar a corrida ${run.id} como ENTREGUE?`)) {
            onComplete(run.id);
        }
    };

    return (
        <TableRow>
            <TableCell className="font-bold">{run.id}</TableCell>
            <TableCell>
                <div className='flex flex-col'>
                    <span className="font-medium text-sm">{run.pickupLocation}</span>
                    <span className="text-xs text-muted-foreground">{run.deliveryAddress}</span>
                </div>
            </TableCell>
            <TableCell>
                 <Badge variant="outline" className={cn("gap-1.5", statusInfo.bgColor, statusInfo.color, 'border-none')}>
                     <statusInfo.icon className="w-3 h-3" />
                     {statusInfo.label}
                 </Badge>
            </TableCell>
            <TableCell className="text-center">{run.estimatedTime} min</TableCell>
            <TableCell className="font-medium text-right">{run.value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</TableCell>
            <TableCell className="text-right">
                {/* AÇÃO DE FINALIZAÇÃO MANUAL */}
                {run.status === 'in_progress' ? (
                    <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 font-bold"
                        onClick={handleComplete}
                    >
                        Entregue!
                    </Button>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                            {run.status === 'delivered' && (
                                <DropdownMenuItem>Ver Recibo</DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </TableCell>
        </TableRow>
    )
}


// --- COMPONENTE PRINCIPAL (COURIER RUNS PAGE) ---

export default function CourierRunsPage() {
    // Inicializa as corridas do LocalStorage
    const [liveRuns, setLiveRuns] = useState<CourierRun[]>(getRunsFromLocalStorage());
    const [showRunModal, setShowRunModal] = useState(false);

    // Efeito para persistir as corridas no LocalStorage
    useEffect(() => {
        saveRunsToLocalStorage(liveRuns);
    }, [liveRuns]);
    
    // Função para atualizar o status da corrida para 'delivered'
    const handleCompleteRun = useCallback((runId: string) => {
        setLiveRuns(prevRuns => prevRuns.map(run => 
            run.id === runId ? { ...run, status: 'delivered' } : run
        ));
    }, []);

    // Função para adicionar a corrida aceita à lista de corridas em andamento
    const handleAcceptRun = useCallback((offer: NewRunOffer) => {
        const newRun: CourierRun = {
            id: offer.id,
            value: offer.value,
            status: 'in_progress', // STATUS DEFINIDO PARA 'EM ANDAMENTO'
            pickupLocation: offer.pickupLocation,
            deliveryAddress: offer.deliveryAddress,
            estimatedTime: Math.floor(Math.random() * 15) + 10,
            customerName: 'Cliente Anônimo',
        };

        setLiveRuns(prevRuns => [newRun, ...prevRuns]);
        setShowRunModal(false);
        
        // REMOVIDO: Simulação automática da entrega
        // O entregador deve clicar manualmente no botão "Entregue!"
        
    }, []);

    const handleSimulateRun = () => {
        setShowRunModal(true);
    };

    const tabs: { value: RunStatus | 'all', label: string }[] = [
        { value: 'all', label: 'Todas' },
        { value: 'in_progress', label: 'Em Andamento' },
        { value: 'delivered', label: 'Concluídas' },
    ];

    const getFilteredRuns = (status: RunStatus | 'all') => {
        if (status === 'all') return liveRuns;
        return liveRuns.filter(r => r.status === status);
    }
    
    return (
        <div className="flex flex-col gap-8 p-4 container">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
                        <Bike />
                        Minhas Corridas
                    </h1>
                    <p className="text-muted-foreground mt-1">Gerencie e acompanhe o status das suas entregas.</p>
                </div>
                
                <Button 
                    onClick={handleSimulateRun}
                    className="h-10 px-4 py-2 font-bold"
                    style={{ backgroundColor: '#FF5050', color: 'white' }}
                >
                    Simular Nova Corrida 🛵
                </Button>
            </div>
            
            <Card>
                <CardContent className="p-0">
                    <Tabs defaultValue="in_progress">
                        <div className="p-2">
                            <TabsList className="h-auto flex-wrap justify-start">
                                {tabs.map(tab => (
                                    <TabsTrigger key={tab.value} value={tab.value}>
                                        {tab.label} ({getFilteredRuns(tab.value).length})
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {tabs.map(tab => {
                            const filteredRuns = getFilteredRuns(tab.value);
                            return (
                                <TabsContent key={tab.value} value={tab.value}>
                                    {filteredRuns.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>ID</TableHead>
                                                    <TableHead>Rota (Coleta/Entrega)</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-center">Tempo Est.</TableHead>
                                                    <TableHead className="text-right">Valor</TableHead>
                                                    <TableHead className="text-right">Ações</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredRuns.sort((a, b) => b.id.localeCompare(a.id)).map(run => (
                                                    <RunRow 
                                                        key={run.id} 
                                                        run={run} 
                                                        onComplete={handleCompleteRun} // Passamos a função de finalização
                                                    />
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="p-8">
                                            <Alert className="text-center">
                                                <MapPin className="w-4 h-4" />
                                                <AlertTitle>Nenhuma corrida encontrada</AlertTitle>
                                                <AlertDescription>
                                                    Não há corridas com o status "{tab.label}" no momento.
                                                </AlertDescription>
                                            </Alert>
                                        </div>
                                    )}
                                </TabsContent>
                            )
                        })}
                    </Tabs>
                </CardContent>
            </Card>
            
            {/* Renderiza o Modal de Nova Corrida condicionalmente */}
            {showRunModal && (
                <NovaCorridaModal 
                    order={{...simulatedOffer, id: `CORRIDA-${Math.floor(Math.random() * 10000)}`}}
                    onClose={() => setShowRunModal(false)} 
                    onAccept={handleAcceptRun} 
                />
            )}
        </div>
    );
}