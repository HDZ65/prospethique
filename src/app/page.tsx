import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { landingConfig } from "@/data/landing";

export default async function LandingPage() {
  return (
    <>
      {/* Section Héro */}
      <section
        className="relative py-32 overflow-hidden "
        aria-labelledby="hero-heading"
      >
        {/* Effet de spot principal */}
        <div className="absolute inset-0 -z-10 ">
          <div 
            className="absolute top-0 left-1/2 w-[1200px] h-[800px] bg-gradient-radial from-primary/90 via-primary/20 to-transparent "
            style={{
              transform: 'translate(-50%, -30%)',
              filter: 'blur(80px)',
            }}
          />
        </div>

        {/* Grille avec effet de fondu */}
        <div 
          className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat bg-center opacity-50 bg-[length:24px_24px] -z-10"
          style={{
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 80%)'
          }}
        />

        {/* Fond dégradé subtil */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background to-background -z-10" />

        <div className="container relative ">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Badge de lancement */}
            <div className="inline-flex items-center rounded-full px-6 py-2 border border-primary/20 bg-primary/10 backdrop-blur-sm">
              <span className="text-sm font-medium text-primary">
                🚀 Nouveau - Découvrez Prospethique
              </span>
            </div>

            <h1
              id="hero-heading"
              className="text-6xl font-semibold tracking-tighter sm:text-7xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] bg-gradient-to-t from-foreground via-foreground/70 to-foreground inline-block text-transparent bg-clip-text"
            >
              {landingConfig.hero.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {landingConfig.hero.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="shadow-lg shadow-primary/25 hover:shadow-primary/35">
                <Link href="/auth/sign-in">
                  Commencer gratuitement
                  <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#fonctionnalites">
                  En savoir plus
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section
        id="fonctionnalites"
        aria-labelledby="features-heading"
        className="py-32 relative"
      >
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2
              id="features-heading"
              className="text-4xl font-bold bg-gradient-to-t from-foreground via-foreground/70 to-foreground inline-block text-transparent bg-clip-text"
            >
              Pourquoi choisir Prospethique ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des outils puissants pour une prospection éthique et efficace
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {landingConfig.features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden border-primary/10 bg-gradient-to-br from-background via-background to-primary/5">
                <CardHeader>
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA améliorée */}
      <section
        className="py-32 relative"
        aria-labelledby="cta-heading"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-background to-background -z-10" />
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2
              id="cta-heading"
              className="text-4xl font-bold bg-gradient-to-t from-foreground via-foreground/70 to-foreground inline-block text-transparent bg-clip-text"
            >
              {landingConfig.cta.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              {landingConfig.cta.subtitle}
            </p>
            <Button asChild size="lg" className="shadow-lg shadow-primary/25">
              <Link href="/auth/sign-in">
                Commencer maintenant
                <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}