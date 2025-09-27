'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card } from '../ui/card';

const chartData = [
  { day: 'Seg', earnings: 55 },
  { day: 'Ter', earnings: 78 },
  { day: 'Qua', earnings: 90 },
  { day: 'Qui', earnings: 62 },
  { day: 'Sex', earnings: 110 },
  { day: 'Sáb', earnings: 154 },
  { day: 'Dom', earnings: 120 },
];

const chartConfig = {
  earnings: {
    label: 'Ganhos',
    color: 'hsl(var(--primary))',
  },
};

const EarningsChart = () => {
  return (
    <Card className='border-none shadow-none p-0'>
      <div className="h-[250px] w-full">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
                tickLine={false}
                axisLine={false}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `R$${value}`}
             />
             <Tooltip 
                cursor={{ fill: 'hsl(var(--background))' }}
                content={<ChartTooltipContent
                    formatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    indicator='dot'
                />}
             />
            <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  );
};

export default EarningsChart;
