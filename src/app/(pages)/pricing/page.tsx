import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"

const tiers = [
  {
    name: "Starter",
    id: "tier-starter",
    href: "/auth/register",
    price: { monthly: "0€" },
    description: "Pour les freelances et petites entreprises",
    features: [
      "Authentification et sécurité",
      "Gestion des prospects",
      "Modèles d'emails personnalisables",
      "Suivi des campagnes",
      "Conformité RGPD",
    ],
    featured: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "/auth/register",
    price: { monthly: "29€" },
    description: "Pour les entreprises en croissance",
    features: [
      "Tout du plan Starter",
      "Automatisation des campagnes",
      "Intégration multicanal",
      "Analyse prédictive",
      "Support prioritaire",
      "API dédiée",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "/auth/register",
    price: { monthly: "Sur mesure" },
    description: "Pour les grandes entreprises",
    features: [
      "Tout du plan Pro",
      "Intelligence artificielle",
      "Formation équipe",
      "Support 24/7",
      "Développement sur mesure",
      "Audit personnalisé",
    ],
    featured: false,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function PricingPage() {
  return (
    <div className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Des tarifs simples et transparents
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Choisissez le plan qui correspond le mieux à vos besoins. Tous les plans incluent une période d'essai de 14 jours.
          </p>
        </div>
        <div className="isolate mx-auto mt-8 grid max-w-md grid-cols-1 gap-y-6 sm:mt-12 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-6 xl:gap-x-8">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={classNames(
                tier.featured ? "ring-2 ring-primary shadow-lg" : "ring-1 ring-border",
                "rounded-2xl p-6 transition-all duration-200 hover:shadow-md hover:ring-primary/50",
                "relative overflow-hidden h-[32rem] flex flex-col"
              )}
            >
              {tier.featured && (
                <div className="absolute -right-12 top-6 rotate-45 bg-primary px-12 py-1 text-xs font-semibold text-primary-foreground">
                  Recommandé
                </div>
              )}
              <CardHeader className="p-0 space-y-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold leading-7">
                    {tier.name}
                  </CardTitle>
                  {tier.featured && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Pro
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm leading-6 text-muted-foreground">
                  {tier.description}
                </CardDescription>
                <p className="flex items-baseline gap-x-1">
                  <span className="text-3xl font-bold tracking-tight">{tier.price.monthly}</span>
                  <span className="text-sm font-semibold leading-6 text-muted-foreground">/mois</span>
                </p>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ul role="list" className="space-y-3 text-sm leading-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-x-2">
                      <Check className="mt-1 h-5 w-5 flex-none text-primary" aria-hidden="true" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-0">
                <Button 
                  asChild 
                  className={classNames(
                    "w-full font-semibold transition-all duration-200",
                    tier.featured 
                      ? "bg-primary hover:bg-primary/90 hover:scale-[1.02]" 
                      : "bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 hover:scale-[1.02]"
                  )}
                >
                  <Link href={tier.href}>
                    Commencer gratuitement
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 