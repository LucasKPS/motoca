'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bike } from "lucide-react";
import { CourierRun } from '@/lib/types';
import SalesChart from '@/components/dashboard/sales-chart';

const RUNS_STORAGE_KEY = 'courier_runs_motoca';
const ONLINE_STATUS_STORAGE_KEY = 'courier_online_status';

export default function CourierHome({ name = "João da Silva" }: { name?: string }) {

    const [isOnline, setIsOnline] = useState(() => {
        if (typeof window === 'undefined') {
            return true;
        }
        const storedStatus = localStorage.getItem(ONLINE_STATUS_STORAGE_KEY);
        return storedStatus ? JSON.parse(storedStatus) : true;
    });

    const [completedRuns, setCompletedRuns] = useState(0);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const updateRunsData = () => {
            const storedRuns = localStorage.getItem(RUNS_STORAGE_KEY);
            if (storedRuns) {
                const runs: CourierRun[] = JSON.parse(storedRuns);
                const deliveredRuns = runs.filter(run => run.status === 'delivered');
                setCompletedRuns(deliveredRuns.length);

                const dailyData = deliveredRuns.reduce((acc, run) => {
                    const date = new Date(run.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                    if (!acc[date]) {
                        acc[date] = { date, completedOrders: 0, totalSales: 0 };
                    }
                    acc[date].completedOrders++;
                    acc[date].totalSales += run.fee;
                    return acc;
                }, {} as Record<string, { date: string; completedOrders: number; totalSales: number }>);

                const chartDataArray = Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setChartData(chartDataArray);
            }
        };

        updateRunsData();

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === RUNS_STORAGE_KEY) {
                updateRunsData();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem(ONLINE_STATUS_STORAGE_KEY, JSON.stringify(isOnline));
    }, [isOnline]);


    const handleToggleStatus = () => {
        setIsOnline((prev: any) => !prev);
    };

    return (
        <div className="flex flex-col gap-8 container py-8 px-4 sm:px-6 lg:px-8">

            <div className="flex justify-end pt-2">
            </div>

            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">

                <div className="text-center">
                    <p className="text-xl text-muted-foreground">Bem-vindo de volta,</p>
                    <h1 className="text-4xl sm:text-5xl font-extrabold font-headline text-foreground tracking-tight mt-1">
                        {name}
                    </h1>
                </div>

                <Button
                    onClick={handleToggleStatus}
                    className={`
                        py-6 px-10 text-lg font-bold shadow-xl transition-colors duration-300
                        ${isOnline
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gray-400 hover:bg-gray-500 text-white'
                        }
                    `}
                >
                    <div className={`w-3 h-3 rounded-full mr-3 ${isOnline ? 'bg-white animate-pulse' : 'bg-white'}`}></div>
                    {isOnline ? 'Online' : 'Offline'}
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="w-full border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-muted-foreground text-center">
                            Corridas do Dia
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2 text-center">
                        <div className="flex items-center justify-center mt-3">
                             <Bike className="w-8 h-8 text-primary opacity-50" />
                        </div>

                        <p className="text-4xl font-extrabold text-foreground mt-2">
                            {String(completedRuns).padStart(2, '0')}
                        </p>

                    </CardContent>
                </Card>
                <Card className="w-full border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-muted-foreground text-center">
                            Desempenho no Período
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SalesChart data={chartData} />
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
