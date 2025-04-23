"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  UserPlus,       // pour Ajouter un prospect
  Upload,         // pour Importer CSV
  FilePlus,       // pour Nouveau template
  History         // pour Voir historique
} from "lucide-react";

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

const quickActions = [
  {
    title: "Ajouter un prospect",
    icon: UserPlus,
    href: "/dashboard/prospects/new",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Importer CSV",
    icon: Upload,
    href: "/dashboard/prospects/import",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Nouveau template",
    icon: FilePlus,
    href: "/dashboard/templates/new",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    title: "Voir historique",
    icon: History,
    href: "/dashboard/campagnes/history",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
];

export default function QuickActionsBar() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 max-w-5xl mx-auto py-4">
      {quickActions.map(({ title, icon: Icon, href, bgColor, iconColor }) => (
        <Link 
          key={title}
          href={href}
        >
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-200 group",
            bgColor,
            "hover:opacity-90 active:scale-95"
          )}>
            <motion.div
              variants={iconVariants}
              initial="initial"
              animate="initial"
              whileHover="hover"
              className="group-hover:animate"
            >
              <Icon className={cn("w-4 h-4", iconColor)} />
            </motion.div>
            <span className="text-sm font-medium text-foreground dark:text-background">
              {title}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
