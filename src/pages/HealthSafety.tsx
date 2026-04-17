import { motion } from "framer-motion";
import { Shield, Info, Eye, Accessibility, Monitor, Gamepad2, Sun, MessageSquare, Menu, ArrowLeft } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HealthSafety() {
  const sections = [
    {
      id: "epilepsy",
      icon: Shield,
      title: "Avertissement sur l’épilepsie photosensible",
      content: "Un faible pourcentage de personnes peut faire une crise d’épilepsie lorsqu’elles sont exposées à certaines images visuelles, notamment des éclairs ou des motifs lumineux pouvant apparaître dans ce logiciel. Même les personnes qui n'ont aucun antécédent de crises ou d'épilepsie peuvent présenter une affection non diagnostiquée qui peut provoquer ces « crises d'épilepsie photosensibles ».",
      details: "Ces crises peuvent présenter divers symptômes, notamment des étourdissements, une vision altérée, des contractions oculaires ou faciales, des secousses ou des tremblements des bras ou des jambes, une désorientation, une confusion ou une perte de conscience momentanée. Les crises peuvent également provoquer une perte de conscience ou des convulsions pouvant entraîner des blessures par chute ou par choc avec des objets à proximité. Cessez immédiatement de jouer et consultez un médecin si vous ressentez l'un de ces symptômes."
    },
    {
      id: "motion-sickness",
      icon: Info,
      title: "Cinétose",
      content: "Si vous ressentez des étourdissements, des nausées, de la fatigue ou des symptômes similaires à ceux du mal des transports pendant que vous utilisez ce logiciel, cessez immédiatement de jouer. Consultez un médecin si l'inconfort persiste."
    },
    {
      id: "accessibility",
      icon: Accessibility,
      title: "Accessibilité",
      content: "Nous nous efforçons de rendre notre plateforme accessible à tous les utilisateurs. Plusieurs options sont disponibles dans les paramètres pour personnaliser votre expérience.",
      details: "Allez dans Paramètres > Accessibilité pour trouver des options telles que le mode daltonisme, la taille du texte, et plus encore."
    },
    {
      id: "resolution",
      icon: Monitor,
      title: "Résolution du moniteur et Format d’image",
      content: "Le logiciel détectera automatiquement la résolution de votre moniteur et le rapport hauteur/largeur pour une expérience optimale.",
      details: "Vous pouvez ajuster ces paramètres manuellement dans le menu Vidéo."
    },
    {
      id: "controls",
      icon: Gamepad2,
      title: "Commandes",
      content: "Les commandes peuvent être personnalisées selon vos préférences.",
      details: "Accédez au menu Commandes pour réattribuer les touches ou ajuster la sensibilité."
    },
    {
      id: "brightness",
      icon: Sun,
      title: "Luminosité",
      content: "Il est important de régler correctement la luminosité pour réduire la fatigue oculaire.",
      details: "Utilisez le curseur de luminosité dans les paramètres Vidéo pour un confort visuel optimal."
    },
    {
      id: "chat",
      icon: MessageSquare,
      title: "Chat",
      content: "Les fonctions de communication sont disponibles pour interagir avec les autres membres de la communauté.",
      details: "Veuillez respecter nos conditions générales de conduite lors de toute interaction."
    },
    {
      id: "others",
      icon: Menu,
      title: "Autres Options",
      content: "Explorez les paramètres pour découvrir d'autres options de personnalisation, de son et de gameplay."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">RealtyCheck</span>
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-12 text-center text-white">
            <Shield className="h-16 w-16 text-primary mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Consignes de santé et de sécurité
            </h1>
            <p className="text-xl text-muted-foreground">
              Veuillez lire attentivement ces informations pour une expérience en toute sécurité.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-8 border-primary/10 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-2xl font-display font-bold text-primary italic">
                        {section.title}
                      </h2>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-white opacity-90 leading-relaxed font-semibold">
                          {section.content}
                        </p>
                        {section.details && (
                          <p className="text-muted-foreground text-sm uppercase italic">
                            {section.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-primary/5 border border-primary/10 text-center">
            <h3 className="text-xl font-display font-semibold mb-4 text-white">
              Besoin d'aide supplémentaire ?
            </h3>
            <p className="text-muted-foreground mb-6">
              Si vous avez des questions spécifiques sur l'accessibilité ou la sécurité, n'hésitez pas à nous contacter.
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              Contacter le support
            </Button>
          </div>
        </motion.div>
      </main>

      <footer className="py-12 border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 RealtyCheck. Santé et Sécurité. Propulsé par la technologie blockchain.</p>
        </div>
      </footer>
    </div>
  );
}
