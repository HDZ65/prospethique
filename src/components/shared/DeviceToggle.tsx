"use client";

import { Monitor, Smartphone } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // Assurez-vous que toggle-group est installé et que le chemin est correct
import { cn } from "@/lib/utils";

export interface DeviceToggleProps {
  className?: string;
  value?: string; // Pour un composant contrôlé
  onValueChange?: (value: string) => void;
}

export function DeviceToggle({ className, value, onValueChange }: DeviceToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(currentValue) => {
        // ToggleGroup peut retourner une chaîne vide si aucun item n'est sélectionné après un clic sur l'item actif.
        // On s'assure de ne passer la valeur que si elle est définie.
        if (currentValue && onValueChange) {
          onValueChange(currentValue);
        }
      }}
      className={cn(
        "", // Styles du conteneur, similaires à ceux existants
        className
      )}
    >
      <ToggleGroupItem
        value="desktop"
        aria-label="Basculer vers la vue Desktop"
        className=""
      >
        <Monitor className="h-4 w-4 mr-1.5 text-blue-600" />
        Desktop
      </ToggleGroupItem>
      <ToggleGroupItem
        value="mobile"
        aria-label="Basculer vers la vue Mobile"
        className=""
      >
        <Smartphone className="h-4 w-4 mr-1.5 text-blue-600" />
        Mobile
      </ToggleGroupItem>
    </ToggleGroup>
  );
} 