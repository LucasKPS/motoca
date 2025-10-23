'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth, useUser } from "@/firebase";
import { getProfile, updateProfile } from '@/firebase/auth';
import { Bike, Edit, Star, Truck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User profile state
  const [name, setName] = useState(user?.displayName ?? 'Usuário');
  const [vehicle, setVehicle] = useState('moto');
  const [plate, setPlate] = useState('');
  const [notifyNewRuns, setNotifyNewRuns] = useState(true);
  const [notifyPromos, setNotifyPromos] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL ?? '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.displayName ?? user.email?.split('@')[0] ?? 'Usuário');
      const fetchProfile = async () => {
        const profile = await getProfile(user.uid);
        if (profile) {
          setVehicle(profile.vehicle ?? 'moto');
          setPlate(profile.plate ?? '');
          setNotifyNewRuns(profile.notifyNewRuns ?? true);
          setNotifyPromos(profile.notifyPromos ?? false);
          setAvatarUrl(profile.avatarUrl ?? user.photoURL ?? '');
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleEditPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
        toast({
          title: "Foto de perfil atualizada!",
          description: "Sua nova foto já está visível. Clique em 'Salvar Alterações' para mantê-la.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

 const handleSaveChanges = async () => {
    if (user) {
        setIsLoading(true);
        try {
            await updateProfile(user.uid, { 
                vehicle, 
                plate, 
                notifyNewRuns, 
                notifyPromos, 
                avatarUrl 
            });
            toast({
                title: "Perfil Salvo!",
                description: "Suas informações foram atualizadas com sucesso.",
            });
        } catch (error) {
            console.error("Erro ao salvar o perfil:", error);
            toast({
                title: "Erro ao Salvar",
                description: "Não foi possível atualizar suas informações. Tente novamente mais tarde.",
                variant: "destructive",
            });
        }
        finally {
            setIsLoading(false);
        }
    }
};


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
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback>{name?.charAt(0) ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-headline">{name}</CardTitle>
                    <CardDescription>{user?.email}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Button variant="outline" size="sm" onClick={handleEditPhotoClick}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Foto
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handlePhotoChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Estatísticas Gerais</CardTitle>
                </CardHeader>
                <CardContent>
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
                    <Select value={vehicle} onValueChange={setVehicle}>
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
                    <Input id="plate" value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} placeholder="ABC-1234"/>
                </div>
                <div className="space-y-4 pt-4">
                    <Label>Notificações</Label>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <p className="text-sm">Novas corridas</p>
                        <Switch checked={notifyNewRuns} onCheckedChange={setNotifyNewRuns} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <p className="text-sm">Promoções e avisos</p>
                        <Switch checked={notifyPromos} onCheckedChange={setNotifyPromos} />
                    </div>
                </div>

                <div className="pt-4">
                     <Button className="w-full" onClick={handleSaveChanges} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </div>
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
