'use client'
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";
import type { Delivery } from "@/lib/types";

export default function SettingsPage({ deliveries = [] }: { deliveries: Delivery[] }) {
    const { user } = useUser();
    const { toast } = useToast();

    const [name, setName] = useState(user?.displayName ?? 'João da Silva');
    const [phone, setPhone] = useState('(11) 99999-8888');
    
    const [notifyNewRuns, setNotifyNewRuns] = useState(true);
    const [notifyPromos, setNotifyPromos] = useState(true);
    const [notifySummary, setNotifySummary] = useState(false);

    const handleSaveInfo = () => {
        toast({
            title: "Informações Salvas",
            description: "Seus dados de perfil foram atualizados.",
        });
    };

    const handleActionClick = (title: string, description: string) => {
        toast({
            title: title,
            description: description,
        });
    }

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
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={user?.email ?? ''} disabled />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="pt-2">
                        <Button onClick={handleSaveInfo}>Salvar Informações</Button>
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
                        <Switch checked={notifyNewRuns} onCheckedChange={setNotifyNewRuns} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                         <div>
                            <p className="font-medium">Alertas de promoções</p>
                            <p className="text-sm text-muted-foreground">Saiba sobre bônus e incentivos.</p>
                        </div>
                        <Switch checked={notifyPromos} onCheckedChange={setNotifyPromos} />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">Resumos semanais por e-mail</p>
                            <p className="text-sm text-muted-foreground">Receba um resumo de seus ganhos e desempenho.</p>
                        </div>
                        <Switch checked={notifySummary} onCheckedChange={setNotifySummary} />
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
                        <Button variant="outline" onClick={() => handleActionClick('Função em Desenvolvimento', 'A alteração de senha estará disponível em breve.')}>Alterar</Button>
                    </div>
                     <Separator />
                     <div className="flex items-center justify-between">
                        <p className="font-medium">Autenticação de dois fatores</p>
                        <Button variant="outline" onClick={() => handleActionClick('Função em Desenvolvimento', 'A autenticação de dois fatores estará disponível em breve.')}>Ativar</Button>
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
                    <Button variant="destructive" onClick={() => handleActionClick('Ação Crítica', 'A exclusão de conta é uma ação permanente. Esta função está desativada na simulação.')}>Excluir minha conta</Button>
                </CardContent>
            </Card>
        </div>
    );
}
