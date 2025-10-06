'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { MenuItem } from "@/lib/types";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const menuItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, { message: "O preço deve ser maior que zero." }),
  category: z.string().min(2, { message: "A categoria é obrigatória." }),
  imageUrl: z.string().url({ message: "Por favor, insira uma URL de imagem válida." }).optional().or(z.literal('')),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

interface MenuItemDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  item?: MenuItem;
  onSave: (item: MenuItem) => void;
}

export function MenuItemDialog({ isOpen, onOpenChange, item, onSave }: MenuItemDialogProps) {
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (item) {
        form.reset(item);
      } else {
        form.reset({ id: undefined, name: '', description: '', price: 0, category: '', imageUrl: '' });
      }
    }
  }, [item, form, isOpen]);

  const onSubmit = (data: MenuItemFormValues) => {
    onSave(data as MenuItem);
  };
  
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{item ? 'Editar Item' : 'Adicionar Novo Item'}</DialogTitle>
          <DialogDescription>
            {item ? 'Atualize as informações do item.' : 'Preencha os detalhes do novo item do cardápio.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Item</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Pizza Margherita" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemplo.com/imagem.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Molho de tomate, mussarela, manjericão..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" placeholder="Ex: 45.50" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                        <Input placeholder="Ex: Pizzas Salgadas" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Item
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
