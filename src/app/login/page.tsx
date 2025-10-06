'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useAuth, useUser } from "@/firebase";
import { initiateEmailSignIn } from "@/firebase/non-blocking-login";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 48 48" {...props}><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.12C34.553 8.248 29.658 6 24 6C12.955 6 4 14.955 4 26s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691c-2.313 4.518-3.469 9.81-3.469 15.309C2.837 36.31 5.253 42.403 9.42 46.185l-7.961-6.383C-1.042 35.853 0 29.87 0 24c0-3.39.69-6.61 1.956-9.611l-7.65-6.699z"></path><path fill="#4B8BF5" d="M24 48c5.658 0 10.553-1.752 14.804-4.818l-7.961-6.383c-2.119 1.885-4.902 3.039-7.961 3.039c-5.223 0-9.651-3.343-11.303-8H4.252C8.503 41.752 15.758 48 24 48z"></path><path fill="#48FF48" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.12C34.553 8.248 29.658 6 24 6C12.955 6 4 14.955 4 26s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path></svg>
    )
}

export default function LoginPage() {
    const auth = useAuth();
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { toast } = useToast();

    // THIS EFFECT IS THE PROBLEM AND WILL BE REMOVED.
    // The DashboardLayout is the single source of truth for protecting routes.
    /*
    useEffect(() => {
        if (!isUserLoading && user) {
            router.replace('/dashboard');
        }
    }, [user, isUserLoading, router]);
    */

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        initiateEmailSignIn(auth, email, password);
        // The onAuthStateChanged listener in DashboardLayout will handle the redirection.
        toast({
            title: "Login em progresso...",
            description: "Você será redirecionado para o seu painel em breve.",
        });
    }
    
    if (isUserLoading || (!isUserLoading && user)) {
        return (
             <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Link href="/" className="inline-block mx-auto mb-4">
                        <Logo className="w-10 h-10 text-primary" />
                    </Link>
                    <CardTitle className="font-headline">Bem-vindo de volta!</CardTitle>
                    <CardDescription>Acesse sua conta para gerenciar seus pedidos e entregas.</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                         <Button type="submit" className="w-full">Entrar</Button>
                    </CardContent>
                </form>
                <CardFooter className="flex flex-col gap-4">
                    <Separator />
                     <Button variant="outline" className="w-full" disabled>
                        <GoogleIcon className="w-5 h-5 mr-2" />
                        Entrar com Google (em breve)
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Não tem uma conta?{' '}
                        <Link href="/signup" className="font-semibold text-primary hover:underline">
                            Crie uma agora
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
