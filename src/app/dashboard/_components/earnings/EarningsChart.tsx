// src/components/earnings/EarningsChart.tsx
'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from 'react';

// Dados de simulação para o gráfico
const data = [
    { name: 'Seg', Ganhos: 125, Corridas: 5 },
    { name: 'Ter', Ganhos: 180, Corridas: 8 },
    { name: 'Qua', Ganhos: 150, Corridas: 6 },
    { name: 'Qui', Ganhos: 220, Corridas: 10 },
    { name: 'Sex', Ganhos: 280, Corridas: 12 },
    { name: 'Sáb', Ganhos: 350, Corridas: 15 },
    { name: 'Dom', Ganhos: 300, Corridas: 11 },
];

// Componente Customizado para Tooltip (opcional, mas profissional)
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        // payload[0] é Ganhos, payload[1] é Corridas
        const ganhos = payload[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const corridas = payload[1].value;
        
        return (
            <div className="p-3 border bg-white shadow-lg rounded-lg text-sm">
                <p className="font-semibold text-primary mb-1">{label}</p>
                <p className="text-foreground">Ganhos: <span className="font-bold">{ganhos}</span></p>
                <p className="text-muted-foreground">Corridas: {corridas}</p>
            </div>
        );
    }
    return null;
};

// Componente Principal
export default function EarningsChart({ chartData = data }: { chartData?: typeof data }) {
    
    // Calcula a altura ideal do gráfico (o wrapper deve ter uma altura definida)
    const height = 300; 
    
    return (
        <div style={{ width: '100%', height: height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 10,
                        left: -20, // Ajuste para mover o eixo Y para a esquerda
                        bottom: 5,
                    }}
                >
                    {/* Linhas de fundo claras */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    
                    {/* Eixo X: Dias da Semana */}
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                    
                    {/* Eixo Y: Ganhos (formatado como moeda) */}
                    <YAxis 
                        yAxisId="left" 
                        stroke="#10B981" 
                        orientation="left" 
                        tickFormatter={(value) => `R$${value}`}
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                    />
                    
                    {/* Eixo Y Secundário: Corridas */}
                    <YAxis 
                        yAxisId="right" 
                        stroke="#6366F1" 
                        orientation="right" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                    />

                    {/* Tooltip personalizado */}
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Legenda com as cores das barras */}
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
                    
                    {/* Barra de Ganhos (Verde) */}
                    <Bar yAxisId="left" dataKey="Ganhos" fill="#10B981" radius={[4, 4, 0, 0]} />
                    
                    {/* Barra de Corridas (Azul - pode ser um gráfico de linha sobreposto, mas mantemos barra para simplicidade visual) */}
                    <Bar yAxisId="right" dataKey="Corridas" fill="#6366F1" radius={[4, 4, 0, 0]} opacity={0.7} />
                    
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}