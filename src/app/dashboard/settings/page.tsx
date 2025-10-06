'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { Delivery } from "@/lib/types";

export default function SettingsPage({ deliveries = [] }: { deliveries: Delivery[] }) {
    return (
        <div className="container mx-auto p-4 flex flex-col gap-8">
            <h1 className="text-3xl font-headline font-bold text-primary">Configurações</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><User/> Perfil e Conta</CardTitle>
                    <CardDescription>Atualize suas informações pessoais e de conta.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input id="name" defaultValue="João da Silva" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="entregador@rotaexpressa.com" disabled />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" type="tel" defaultValue="(11) 99999-8888" />
                    </div>
                    <div className="pt-2">
                        <Button>Salvar Informações</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><Bell/> Notificações</CardTitle>
                    <CardDescription>Gerencie como você recebe as comunicações do app.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">Notificações de novas corridas</p>
                            <p className="text-sm text-muted-foreground">Receba alertas em tempo real sobre novas entregas.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                         <div>
                            <p className="font-medium">Alertas de promoções</p>
                            <p className="text-sm text-muted-foreground">Saiba sobre bônus e incentivos.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">Resumos semanais por e-mail</p>
                            <p className="text-sm text-muted-foreground">Receba um resumo de seus ganhos e desempenho.</p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><Shield/> Segurança</CardTitle>
                    <CardDescription>Gerencie a segurança da sua conta.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between">
                        <p className="font-medium">Alterar senha</p>
                        <Button variant="outline">Alterar</Button>
                    </div>
                     <Separator />
                     <div className="flex items-center justify-between">
                        <p className="font-medium">Autenticação de dois fatores</p>
                        <Button variant="outline">Ativar</Button>
                    </div>
                </CardContent>
            </Card>

             <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-destructive">Zona de Perigo</CardTitle>
                    <CardDescription>Ações permanentes que não podem ser desfeitas.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                     <p className="font-medium">Excluir conta</p>
                    <Button variant="destructive">Excluir minha conta</Button>
                </CardContent>
            </Card>
        </div>
    );
}
