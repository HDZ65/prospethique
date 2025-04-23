"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  Rocket,
  BarChart3,
  Brain,
  Upload,
  History,
  Lightbulb
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const iconVariants = {
  initial: { rotate: 0 },
  hover: { 
    rotate: [0, 20, -10, 0],
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

const actions = [
  {
    title: "Prospects",
    description: "Gérez votre liste de prospects et leurs informations",
    icon: Users,
    href: "/dashboard/prospects",
    color: "bg-blue-500 dark:bg-blue-700",
  },
  {
    title: "Templates",
    description: "Créez et gérez vos modèles d'emails personnalisés",
    icon: FileText,
    href: "/dashboard/templates",
    color: "bg-green-500 dark:bg-green-700",
  },
  {
    title: "Créer Campagne",
    description: "Lancez une nouvelle campagne d'emailing",
    icon: Rocket,
    href: "/dashboard/campagnes",
    color: "bg-orange-500 dark:bg-orange-700",
  },
  {
    title: "Statistiques",
    description: "Visualisez les performances de vos campagnes",
    icon: BarChart3,
    href: "/dashboard/statistiques",
    color: "bg-purple-500 dark:bg-purple-700",
  },
  {
    title: "Génération IA",
    description: "Générez du contenu avec l'aide de l'IA",
    icon: Brain,
    href: "/dashboard/templates/new",
    color: "bg-pink-500 dark:bg-pink-700",
  },
  {
    title: "Import CSV",
    description: "Importez vos prospects depuis un fichier CSV",
    icon: Upload,
    href: "/dashboard/prospects/import",
    color: "bg-yellow-500 dark:bg-yellow-700",
  },
  {
    title: "Historique",
    description: "Consultez l'historique de vos campagnes",
    icon: History,
    href: "/dashboard/campagnes/history",
    color: "bg-indigo-500 dark:bg-indigo-700",
  },
  {
    title: "Inspiration",
    description: "Trouvez l'inspiration pour vos campagnes",
    icon: Lightbulb,
    href: "/dashboard/inspiration",
    color: "bg-red-500 dark:bg-red-700",
  },
];

export default function DashboardQuickActions() {
  return (
    <TooltipProvider>
      <div className="flex justify-between max-w-6xl mx-auto gap-12 py-12 px-8 flex-wrap">
        {actions.map(({ title, description, icon: Icon, href, color }) => (
          <Tooltip key={title}>
            <TooltipTrigger asChild>
              <Link href={href}>
                <div className="flex flex-col items-center gap-3 group relative cursor-pointer">
                  <motion.div
                    variants={iconVariants}
                    initial="initial"
                    animate="initial"
                    whileHover="hover"
                    className="group-hover:animate"
                  >
                  <div
                    className={cn(
                      "rounded-full p-6",
                      color,
                      "shadow-lg dark:opacity-90 dark:group-hover:opacity-100 transition-all duration-150 group-hover:scale-110 group-active:scale-95"
                    )}
                  >
                      <Icon className="w-7 h-7 text-white" />
                  </div>
                    </motion.div>
                  <span className="text-center text-sm font-medium">
                    {title}
                  </span>
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}