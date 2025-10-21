'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Bike, CheckCircle, Clock, MapPin, AlertTriangle, Truck, BellRing, Utensils, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// IMPORTANDO COMPONENTES DE DIÁLOGO SHADCN
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

// CORREÇÃO: Importando DialogTitle para o Modal de Nova Corrida
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle // CORRIGIDO: Necessário para Acessibilidade (A11y)
} from "@/components/ui/dialog";

// --- TIPAGEM E CHAVES DE DADOS (Mantidas) ---

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
const ONLINE_STATUS_STORAGE_KEY = 'courier_online_status';



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

// Dados de exemplo para a corrida simulada (Mantidos e usados no handleSimulateRun)
const createSimulatedOffer = (): NewRunOffer => ({
    id: `CORRIDA-${Math.floor(Math.random() * 10000)}`,
    type: 'Corrida',
    value: parseFloat((Math.random() * 15 + 10).toFixed(2)),
    timeToAccept: 30,
    pickupLocation: ['Hamburgueria do Chef', 'Mercado Central', 'Farmácia Pague Menos'][Math.floor(Math.random() * 3)],
    deliveryAddress: `Rua das Flores, ${Math.floor(Math.random() * 100)}, Rio de Janeiro - RJ`,
});


// --- COMPONENTE MODAL DE CONFIRMAÇÃO ESTILIZADO (Entregue) ---

interface ConfirmationDialogProps {
    open: boolean;
    runId: string | null;
    onClose: () => void;
    onConfirm: (runId: string) => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, runId, onClose, onConfirm }) => {
    const handleConfirm = () => {
        if (runId) {
            onConfirm(runId);
        }
        onClose();
    };

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent className="bg-white rounded-lg shadow-2xl p-6">
                <AlertDialogHeader>
                    <div className="flex items-center text-green-600 mb-2">
                        <Truck className="h-6 w-6 mr-2" />
                        <AlertDialogTitle className="text-xl font-bold">
                            Finalizar Entrega?
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-gray-600 mt-2">
                        Tem certeza que deseja marcar a corrida <span className="font-semibold text-primary">{runId}</span> como **ENTREGUE**? O valor será adicionado aos seus ganhos.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="pt-4 flex flex-row justify-end gap-3">
                    <AlertDialogCancel asChild>
                        <Button variant="outline" className="font-semibold">
                            Cancelar
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            onClick={handleConfirm}
                            className="bg-green-600 hover:bg-green-700 font-bold"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Sim, Entregue!
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};


// --- COMPONENTE MODAL DE NOVA CORRIDA (AGORA CORRIGIDO) ---

interface NovaCorridaModalProps {
    order: NewRunOffer;
    onClose: () => void;
    onAccept: (run: NewRunOffer) => void;
    onReject: () => void;
}

const NovaCorridaModal: React.FC<NovaCorridaModalProps> = ({ order, onClose, onAccept, onReject }) => {
    const [countdown, setCountdown] = useState(order.timeToAccept);
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        setCountdown(order.timeToAccept);
        setExpired(false);
    }, [order.timeToAccept]);

    useEffect(() => {
        if (countdown <= 0) {
            setExpired(true);
            const timer = setTimeout(() => {
                onReject(); // Rejeita e fecha o modal automaticamente ao expirar
            }, 1000); // Espera um segundo para mostrar a expiração
            return () => clearTimeout(timer);
        }

        const interval = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [countdown, onReject]);

    // Função para aceitar e fechar
    const handleAccept = () => {
        if (!expired) {
            onAccept(order);
        }
    };

    // Função para rejeitar e fechar
    const handleReject = () => {
        onReject();
    };

    return (
        <Dialog open={true} onOpenChange={expired ? () => {} : onClose}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden rounded-xl">
                {/* Cabeçalho Estilizado - Fundo Vermelho/Branco como no print */}
                <DialogHeader className="p-6 bg-white border-b border-gray-100 flex flex-row justify-between items-center">
                    <div className='flex items-center gap-3'>
                        <BellRing className="h-6 w-6 text-[#FF5050] animate-pulse" />
                        {/* CORREÇÃO APLICADA: Envolver o <h2> com DialogTitle e usar asChild */}
                        <DialogTitle asChild>
                            <h2 className="text-xl font-extrabold text-[#FF5050]">
                                Novo Pedido!
                            </h2>
                        </DialogTitle>
                    </div>
                    {/* Valor da Corrida */}
                    <p className="text-2xl font-bold text-gray-800">
                        {order.value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                    </p>
                </DialogHeader>

                {/* Corpo do Conteúdo */}
                <div className="p-6 flex flex-col gap-4">
                    <p className="text-sm text-center text-gray-600">
                        Você tem <span className={cn("font-bold", countdown <= 10 ? "text-red-500" : "text-primary")}>{countdown}</span> segundos para aceitar.
                        {expired && <span className="text-red-500 font-bold ml-2"> (Tempo Esgotado!)</span>}
                    </p>

                    {/* Card de Detalhes - Itens */}
                    <Card className="bg-gray-50 border-gray-200">
                        <CardContent className="p-3 flex items-center gap-3">
                            <Utensils className="h-5 w-5 text-gray-500" />
                            <div className='flex flex-col'>
                                <span className="text-sm font-semibold">Itens:</span>
                                <span className="text-base font-bold text-gray-800">
                                    2 itens
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card de Detalhes - Cliente */}
                    <Card className="bg-gray-50 border-gray-200">
                        <CardContent className="p-3 flex items-center gap-3">
                            <User className="h-5 w-5 text-gray-500" />
                            <div className='flex flex-col'>
                                <span className="text-sm font-semibold">Cliente:</span>
                                <span className="text-base font-bold text-gray-800">
                                    Cliente Simulado
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detalhes da Rota (Opcional, mas útil) */}
                    <div className="space-y-2 text-sm text-gray-700">
                        <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className='font-semibold'>Coleta:</span> {order.pickupLocation}
                        </p>
                        <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-red-500" />
                            <span className='font-semibold'>Entrega:</span> {order.deliveryAddress}
                        </p>
                    </div>

                </div>

                {/* Rodapé com Ações - Buttons Grande como no print */}
                <div className="p-6 pt-0 flex justify-between gap-4">
                    <Button
                        onClick={handleReject}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg"
                        disabled={expired}
                    >
                        <AlertTriangle className="h-5 w-5 mr-2" /> Recusar
                    </Button>
                    <Button
                        onClick={handleAccept}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg"
                        disabled={expired}
                    >
                        <CheckCircle className="h-5 w-5 mr-2" /> Aceitar
                    </Button>
                </div>
                {expired && (
                     <div className="bg-red-100 p-2 text-center text-red-700 font-semibold">
                        Oferta expirada.
                    </div>
                )}
            </DialogContent>
        </Dialog>
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
    onOpenConfirm: (runId: string) => void;
}

const RunRow: React.FC<RunRowProps> = ({ run, onOpenConfirm }) => {
    const statusInfo = runStatusMap[run.status];

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
                {/* AÇÃO DE FINALIZAÇÃO MANUAL (Chama a abertura do Modal) */}
                {run.status === 'in_progress' ? (
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 font-bold"
                        onClick={() => onOpenConfirm(run.id)}
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
    const [liveRuns, setLiveRuns] = useState<CourierRun[]>(getRunsFromLocalStorage());
    const [offer, setOffer] = useState<NewRunOffer | null>(null); // ALTERADO: Para armazenar a oferta completa

    // NOVO ESTADO: Rastreia a corrida a ser confirmada
    const [runIdToComplete, setRunIdToComplete] = useState<string | null>(null);

    const [isOnline, setIsOnline] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedStatus = localStorage.getItem(ONLINE_STATUS_STORAGE_KEY);
            return storedStatus ? JSON.parse(storedStatus) : true;
        }
        return true;
    });

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === ONLINE_STATUS_STORAGE_KEY) {
                setIsOnline(event.newValue ? JSON.parse(event.newValue) : true);
            }
        };

        const storedStatus = localStorage.getItem(ONLINE_STATUS_STORAGE_KEY);
        if (storedStatus) {
            setIsOnline(JSON.parse(storedStatus));
        }

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Efeito para persistir as corridas
    useEffect(() => {
        saveRunsToLocalStorage(liveRuns);
    }, [liveRuns]);

    // Função que será passada para o Dialog
    const handleConfirmCompletion = useCallback((runId: string) => {
        // Adicionando timestamp de entrega no momento da conclusão
        const deliveredAt = new Date().toISOString();
        setLiveRuns(prevRuns => prevRuns.map(run =>
            run.id === runId ? { ...run, status: 'delivered', deliveredAt } : run
        ));
    }, []);

    // Função para abrir o modal de confirmação
    const handleOpenConfirm = useCallback((runId: string) => {
        setRunIdToComplete(runId);
    }, []);

    // Função para fechar o modal de confirmação
    const handleCloseConfirm = useCallback(() => {
        setRunIdToComplete(null);
    }, []);

    const handleAcceptRun = useCallback((offer: NewRunOffer) => {
        const newRun: CourierRun = {
            id: offer.id,
            value: offer.value,
            status: 'in_progress',
            pickupLocation: offer.pickupLocation,
            deliveryAddress: offer.deliveryAddress,
            estimatedTime: Math.floor(Math.random() * 15) + 10,
            customerName: 'Cliente Simulado', // Mantido para consistência
        };

        setLiveRuns(prevRuns => [newRun, ...prevRuns]);
        setOffer(null); // Fecha o modal após aceitar
    }, []);

    const handleRejectRun = useCallback(() => {
        setOffer(null); // Fecha o modal ao rejeitar
    }, []);

    const handleSimulateRun = () => {
        // Gera uma nova oferta e armazena no estado para abrir o modal
        setOffer(createSimulatedOffer());
    };

    // ... (Definição de tabs e getFilteredRuns - mantida)
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
            {/* ... (Cabeçalho - mantido) */}
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
                    disabled={!isOnline}
                    className="h-10 px-4 py-2 font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    style={{ backgroundColor: isOnline ? '#FF5050' : undefined, color: 'white' }}
                >
                    {isOnline ? 'Simular Nova Corrida 🛵' : 'Fique Online para Simular'}
                </Button>
            </div>

            {!isOnline && (
                 <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Você está Offline</AlertTitle>
                    <AlertDescription>
                       Para receber e simular novas corridas, por favor, altere seu status para "Online" na tela de Início.
                    </AlertDescription>
                </Alert>
            )}

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
                                                        onOpenConfirm={handleOpenConfirm}
                                                    />
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="p-8">
                                            {/* ... (Alert de Nenhuma Corrida - mantido) */}
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

            {/* NOVO: RENDERIZAÇÃO DO MODAL DE NOVA CORRIDA */}
            {offer && (
                <NovaCorridaModal
                    order={offer}
                    onClose={handleRejectRun} // Fecha o modal se o usuário clicar no backdrop (padrão Dialog)
                    onAccept={handleAcceptRun}
                    onReject={handleRejectRun}
                />
            )}

            {/* MODAL DE CONFIRMAÇÃO ESTILIZADO (Entregue) */}
            {runIdToComplete && (
                <ConfirmationDialog
                    open={!!runIdToComplete}
                    runId={runIdToComplete}
                    onClose={handleCloseConfirm}
                    onConfirm={handleConfirmCompletion}
                />
            )}
        </div>
    );
}
