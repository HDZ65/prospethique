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
        className="py-20"
        aria-labelledby="hero-heading"
      >
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1
              id="hero-heading"
              className="text-5xl font-bold tracking-tighter"
            >
              {landingConfig.hero.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {landingConfig.hero.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/auth/sign-in">
                  Commencer gratuitement
                  <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
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
        className="py-20 bg-muted/50"
      >
        <div className="container">
          <h2
            id="features-heading"
            className="text-3xl font-bold text-center mb-12"
          >
            Pourquoi choisir ProspEthique ?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {landingConfig.features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section
        className="py-20"
        aria-labelledby="cta-heading"
      >
        <div className="container text-center space-y-6">
          <h2
            id="cta-heading"
            className="text-3xl font-bold"
          >
            {landingConfig.cta.title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {landingConfig.cta.subtitle}
          </p>
          <Button asChild size="lg">
            <Link href="/auth/sign-in">
              Commencer maintenant
              <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}