'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Briefcase, Bike } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/firebase";
import { initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { useToast } from "@/hooks/use-toast";

function SignupForm({ role, onFormSubmit }: { role: 'client' | 'merchant' | 'courier', onFormSubmit: (data: any) => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [restaurantName, setRestaurantName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = { email, password, role, name, restaurantName, cnpj, phone };
        onFormSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {role === 'merchant' && (
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="restaurant-name">Nome do Restaurante</Label>
                        <Input id="restaurant-name" placeholder="Pizzaria Delícia" required value={restaurantName} onChange={e => setRestaurantName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input id="cnpj" placeholder="00.000.000/0001-00" required value={cnpj} onChange={e => setCnpj(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email-merchant">E-mail de Contato</Label>
                        <Input id="email-merchant" type="email" placeholder="contato@pizzaria.com" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="password-merchant">Senha</Label>
                        <Input id="password-merchant" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                </CardContent>
            )}

            {role === 'courier' && (
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="name-courier">Nome Completo</Label>
                        <Input id="name-courier" placeholder="Seu nome" required value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone-courier">Celular com DDD</Label>
                        <Input id="phone-courier" type="tel" placeholder="(11) 99999-9999" required value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email-courier">E-mail</Label>
                        <Input id="email-courier" type="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="password-courier">Senha</Label>
                        <Input id="password-courier" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                </CardContent>
            )}

            {role === 'client' && (
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="name-client">Nome Completo</Label>
                        <Input id="name-client" placeholder="Seu nome" required value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email-client">E-mail</Label>
                        <Input id="email-client" type="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password-client">Senha</Label>
                        <Input id="password-client" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                </CardContent>
            )}
            <CardFooter className="flex flex-col gap-4 px-6 pb-6">
                <Button type="submit" className="w-full">Criar conta</Button>
                <p className="text-sm text-muted-foreground">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="font-semibold text-primary hover:underline">
                        Faça login
                    </Link>
                </p>
            </CardFooter>
        </form>
    );
}

export default function SignupPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const roleParam = searchParams.get('role');
    const role = (roleParam === 'client' || roleParam === 'merchant' || roleParam === 'courier') ? roleParam : 'client';
    
    const auth = useAuth();
    const { toast } = useToast();

    const handleSignup = async (formData: any) => {
        try {
            initiateEmailSignUp(auth, formData.email, formData.password);
            // Here you would typically also save the user's role and other details to Firestore
            // For now, we just sign them up.
            router.push('/dashboard');
             toast({
                title: "Conta criada com sucesso!",
                description: "Você será redirecionado para o seu painel.",
            });
        } catch (error: any) {
            console.error("Signup Error", error);
            toast({
                variant: "destructive",
                title: "Erro ao criar conta",
                description: error.message || "Ocorreu um problema, por favor tente novamente.",
            });
        }
    };

    const metadata = {
        client: {
            title: 'Crie sua Conta',
            description: 'Peça sua comida favorita com rapidez e facilidade.',
            icon: <User className="mr-2" />,
        },
        merchant: {
            title: 'Cadastro de Restaurante',
            description: 'Alcance mais clientes e gerencie seus pedidos.',
            icon: <Briefcase className="mr-2" />,
        },
        courier: {
            title: 'Cadastro de Entregador',
            description: 'Ganhe dinheiro com flexibilidade.',
            icon: <Bike className="mr-2" />,
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Link href="/" className="inline-block mx-auto mb-4">
                        <Logo className="w-10 h-10 text-primary" />
                    </Link>
                    <CardTitle className="font-headline">{metadata[role].title}</CardTitle>
                    <CardDescription>{metadata[role].description}</CardDescription>
                </CardHeader>
                <Tabs defaultValue={role} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="client" asChild><Link href="/signup?role=client"><User className="mr-1 h-4 w-4"/>Cliente</Link></TabsTrigger>
                        <TabsTrigger value="merchant" asChild><Link href="/signup?role=merchant"><Briefcase className="mr-1 h-4 w-4"/>Restaurante</Link></TabsTrigger>
                        <TabsTrigger value="courier" asChild><Link href="/signup?role=courier"><Bike className="mr-1 h-4 w-4"/>Entregador</Link></TabsTrigger>
                    </TabsList>
                    <SignupForm role={role} onFormSubmit={handleSignup} />
                </Tabs>
            </Card>
        </div>
    );
}
