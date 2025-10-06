'use client';

import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface CategoryCardProps {
    icon: LucideIcon;
    label: string;
}

export default function CategoryCard({ icon: Icon, label }: CategoryCardProps) {
    return (
        <Card className="hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-center">{label}</span>
            </CardContent>
        </Card>
    );
}
