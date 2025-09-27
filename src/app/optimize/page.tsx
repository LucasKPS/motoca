'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, XCircle, Loader2, Route, ArrowRight, ListOrdered } from 'lucide-react';
import { getOptimizedRoute } from './actions';
import type { OptimizeDeliveryRouteOutput } from '@/ai/flows/optimize-delivery-route';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  currentLocation: z.string().min(1, "Localização atual é obrigatória."),
  rerouteBasedOnVolume: z.boolean(),
  deliveries: z.array(z.object({
    address: z.string().min(1, "Endereço é obrigatório."),
  })).min(1, "Adicione pelo menos uma entrega."),
});

type FormValues = z.infer<typeof formSchema>;

export default function OptimizePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizeDeliveryRouteOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentLocation: 'Avenida Faria Lima, 4500, São Paulo, SP',
      rerouteBasedOnVolume: false,
      deliveries: [{ address: 'Rua das Flores, 123, São Paulo, SP' }, { address: 'Avenida Paulista, 1500, São Paulo, SP' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'deliveries',
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);
    try {
      const input = {
        ...data,
        deliveries: data.deliveries.map((d, i) => ({ ...d, id: `entrega-${i + 1}` })),
        trafficConditions: 'moderate', // Placeholder
      };
      const response = await getOptimizedRoute(input);
      setResult(response);
    } catch (error) {
      console.error('Error optimizing route:', error);
      toast({
        title: 'Erro na Otimização',
        description: 'Não foi possível gerar a rota otimizada. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-headline font-bold text-primary">Otimização de Rota</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Informações da Rota</CardTitle>
            <CardDescription>Preencha os detalhes para gerar a rota mais rápida.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="currentLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sua Localização Atual</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Av. Paulista, 1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label>Entregas</Label>
                  <div className="space-y-2 mt-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`deliveries.${index}.address`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder={`Endereço da entrega #${index + 1}`} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="shrink-0">
                          <XCircle className="w-5 h-5 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" className="mt-2 gap-2" onClick={() => append({ address: '' })}>
                    <PlusCircle className="w-4 h-4" />
                    Adicionar Entrega
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="rerouteBasedOnVolume"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Rerrotear por Volume</FormLabel>
                        <p className="text-[0.8rem] text-muted-foreground">
                          Permitir que a IA ajuste a rota com base no volume de entregas.
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Route className="mr-2 h-4 w-4" />}
                  {isLoading ? 'Otimizando...' : 'Otimizar Rota'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline">Rota Sugerida</CardTitle>
            <CardDescription>A ordem de entrega otimizada aparecerá aqui.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center gap-4 p-8 text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p>Analisando a melhor rota...</p>
              </div>
            )}
            {result && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold font-headline">Resumo da IA</h3>
                  <p className="text-sm bg-primary/10 p-3 rounded-md mt-2">{result.summary}</p>
                </div>
                <div>
                  <h3 className="font-semibold font-headline mb-2 flex items-center gap-2"><ListOrdered className="text-primary"/> Ordem das Entregas</h3>
                  <ul className="space-y-3">
                    {result.optimizedRoute.map((stop, index) => (
                      <li key={stop.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center font-bold text-sm mt-0.5">{index + 1}</div>
                        <div>
                          <p className="font-medium">{stop.address}</p>
                           {stop.estimatedArrivalTime && <p className="text-sm text-muted-foreground">
                            Chegada estimada: {new Date(stop.estimatedArrivalTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                 <Button className="w-full mt-4">
                  Iniciar Rota
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
            {!isLoading && !result && (
              <div className="text-center text-muted-foreground p-8">
                <Route className="w-10 h-10 mx-auto mb-2" />
                Sua rota otimizada será exibida aqui.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
