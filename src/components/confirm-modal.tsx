'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils/core/cn";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
    confirmVariant?: 'default' | 'destructive';
    children?: React.ReactNode;
    className?: string;
}

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    cancelText = "Annuler",
    confirmText = "Confirmer",
    confirmVariant = 'default',
    children,
}: ConfirmModalProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="border-white/10">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-semibold text-text-primary">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-text-secondary">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {children}
                <AlertDialogFooter className="mt-6 space-x-2">
                    <AlertDialogCancel 
                        className="bg-muted/60 hover:bg-muted border-white/10 text-text-primary"
                        onClick={onClose}
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={cn(
                            "text-white",
                            confirmVariant === 'destructive' 
                                ? "bg-red-500/80 hover:bg-red-500" 
                                : "bg-primary/80 hover:bg-primary"
                        )}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};