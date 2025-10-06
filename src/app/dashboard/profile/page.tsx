'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth, useUser } from "@/firebase";
import { Bike, DollarSign, Edit, Star, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Delivery } from "@/lib/types";


export default function ProfilePage({ deliveries }: { deliveries: Delivery[] }) {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const deliveredDeliveries = deliveries.filter(d => d.status === 'delivered');
  const totalDeliveries = deliveredDeliveries.length;
  const totalEarnings = deliveredDeliveries.reduce((acc, d) => acc + d.earnings, 0);

  const handleLogout = () => {
    auth.signOut();
    router.push('/');
  }

  return (
    <div className="flex flex-col gap-8 p-4 container">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold text-primary">Meu Perfil</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        <div className="lg:col-span-1 flex flex-col gap-8">
            <Card>
                <CardHeader className="items-center text-center">
                    <Avatar className="w-24 h-24 mb-4">
                        <AvatarImage src={user?.photoURL ?? `https://i.pravatar.cc/150?u=${user?.uid}`} />
                        <AvatarFallback>{user?.displayName?.charAt(0) ?? user?.email?.charAt(0) ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-headline">{user?.displayName ?? 'Usuário'}</CardTitle>
                    <CardDescription>{user?.email}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Foto
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Estatísticas Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="w-5 h-5 text-primary" />
                            Ganhos Totais
                        </Label>
                        <span className="font-bold font-headline text-lg">
                            {totalEarnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2 text-muted-foreground">
                            <Truck className="w-5 h-5 text-primary" />
                            Entregas Totais
                        </Label>
                        <span className="font-bold font-headline text-lg">{totalDeliveries}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2 text-muted-foreground">
                            <Star className="w-5 h-5 text-primary" />
                            Avaliação Média
                        </Label>
                        <span className="font-bold font-headline text-lg flex items-center">4.9 <Star className="w-4 h-4 ml-1 text-amber-400 fill-amber-400"/></span>
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <div className="lg:col-span-2">
            <Card>
            <CardHeader>
                <CardTitle className="font-headline">Informações e Preferências</CardTitle>
                <CardDescription>Gerencie seus dados e configurações do app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="vehicle">Veículo Padrão</Label>
                    <Select defaultValue="moto">
                        <SelectTrigger id="vehicle">
                            <SelectValue placeholder="Selecione seu veículo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="moto">
                                <div className="flex items-center gap-2">
                                <Bike className="w-4 h-4"/> Moto
                                </div>
                            </SelectItem>
                            <SelectItem value="carro" disabled>
                                <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4"/> Carro (em breve)
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="plate">Placa do Veículo</Label>
                    <Input id="plate" defaultValue="BRA2E19" />
                </div>
                <div className="space-y-4 pt-4">
                    <Label>Notificações</Label>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <p className="text-sm">Novas corridas</p>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <p className="text-sm">Promoções e avisos</p>
                        <Switch />
                    </div>
                </div>

                <div className="pt-4">
                    <Button className="w-full">Salvar Alterações</Button>
                </div>
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
