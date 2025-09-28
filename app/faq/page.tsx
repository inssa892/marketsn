import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ShoppingBag, HelpCircle, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ - DakarMarket',
  description: 'Trouvez des réponses aux questions les plus fréquentes sur DakarMarket.',
}

export default function FAQPage() {
  const faqCategories = [
    {
      title: 'Compte et inscription',
      questions: [
        {
          question: 'Comment créer un compte sur DakarMarket ?',
          answer: 'Cliquez sur "S\'inscrire" en haut de la page, choisissez votre type de compte (Client ou Marchand), remplissez le formulaire avec vos informations et validez votre inscription.'
        },
        {
          question: 'Quelle est la différence entre un compte Client et Marchand ?',
          answer: 'Un compte Client permet d\'acheter des produits, de gérer son panier et ses commandes. Un compte Marchand permet de vendre des produits, de gérer son inventaire et de traiter les commandes reçues.'
        },
        {
          question: 'Comment modifier mes informations personnelles ?',
          answer: 'Connectez-vous à votre compte, allez dans "Paramètres" puis "Profil" pour modifier vos informations personnelles, votre photo de profil et vos coordonnées.'
        },
        {
          question: 'J\'ai oublié mon mot de passe, que faire ?',
          answer: 'Sur la page de connexion, cliquez sur "Mot de passe oublié", saisissez votre adresse email et suivez les instructions reçues par email pour réinitialiser votre mot de passe.'
        }
      ]
    },
    {
      title: 'Achats et commandes',
      questions: [
        {
          question: 'Comment passer une commande ?',
          answer: 'Parcourez les produits, ajoutez ceux qui vous intéressent à votre panier, vérifiez votre panier puis cliquez sur "Commander" pour finaliser votre achat.'
        },
        {
          question: 'Comment suivre ma commande ?',
          answer: 'Dans votre espace client, section "Mes commandes", vous pouvez voir l\'état de toutes vos commandes : en attente, confirmée, expédiée ou livrée.'
        },
        {
          question: 'Puis-je annuler ma commande ?',
          answer: 'Vous pouvez annuler une commande tant qu\'elle n\'a pas été confirmée par le marchand. Contactez directement le marchand via la messagerie pour toute demande d\'annulation.'
        },
        {
          question: 'Quels sont les modes de paiement acceptés ?',
          answer: 'Les modes de paiement varient selon les marchands : paiement mobile (Orange Money, Wave), paiement à la livraison, ou virement bancaire.'
        }
      ]
    },
    {
      title: 'Vente et marchands',
      questions: [
        {
          question: 'Comment devenir marchand sur DakarMarket ?',
          answer: 'Créez un compte en sélectionnant "Marchand" lors de l\'inscription. Une fois votre compte validé, vous pourrez ajouter vos produits et commencer à vendre.'
        },
        {
          question: 'Comment ajouter un produit ?',
          answer: 'Dans votre dashboard marchand, cliquez sur "Ajouter un produit", remplissez les informations (titre, description, prix, catégorie), ajoutez des photos et publiez votre produit.'
        },
        {
          question: 'Comment gérer mes commandes reçues ?',
          answer: 'Dans la section "Commandes" de votre dashboard, vous pouvez voir toutes les commandes reçues et mettre à jour leur statut (confirmée, expédiée, livrée).'
        },
        {
          question: 'Y a-t-il des frais pour vendre sur DakarMarket ?',
          answer: 'L\'inscription et l\'ajout de produits sont gratuits. Des frais de transaction peuvent s\'appliquer selon le mode de paiement choisi.'
        }
      ]
    },
    {
      title: 'Livraison et retours',
      questions: [
        {
          question: 'Quels sont les délais de livraison ?',
          answer: 'Les délais de livraison dépendent du marchand et de votre localisation. En général, comptez 1 à 3 jours ouvrés pour Dakar et sa banlieue.'
        },
        {
          question: 'Quels sont les frais de livraison ?',
          answer: 'Les frais de livraison sont définis par chaque marchand et affichés avant la finalisation de votre commande. Certains marchands offrent la livraison gratuite.'
        },
        {
          question: 'Puis-je retourner un produit ?',
          answer: 'Les conditions de retour dépendent de chaque marchand. Consultez les conditions de vente du marchand ou contactez-le directement pour connaître sa politique de retour.'
        },
        {
          question: 'Que faire si mon produit arrive endommagé ?',
          answer: 'Contactez immédiatement le marchand via la messagerie avec des photos du produit endommagé. Le marchand vous proposera une solution (échange, remboursement, etc.).'
        }
      ]
    },
    {
      title: 'Technique et sécurité',
      questions: [
        {
          question: 'Mes données personnelles sont-elles sécurisées ?',
          answer: 'Oui, nous utilisons des protocoles de sécurité avancés pour protéger vos données. Vos informations personnelles ne sont jamais partagées avec des tiers sans votre consentement.'
        },
        {
          question: 'Comment contacter un marchand ?',
          answer: 'Utilisez la messagerie intégrée à la plateforme. Sur la page d\'un produit ou dans vos commandes, cliquez sur "Contacter le marchand" pour envoyer un message.'
        },
        {
          question: 'L\'application mobile est-elle disponible ?',
          answer: 'DakarMarket est optimisé pour mobile et fonctionne parfaitement sur tous les navigateurs mobiles. Une application native est en cours de développement.'
        },
        {
          question: 'Comment signaler un problème ou un contenu inapproprié ?',
          answer: 'Utilisez le formulaire de contact ou envoyez-nous un email à contact@dakarmarket.sn en décrivant le problème rencontré.'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">DakarMarket</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Accueil
            </Link>
            <Link href="/dashboard/products" className="text-sm font-medium hover:text-primary">
              Produits
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              À propos
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <HelpCircle className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Questions fréquentes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trouvez rapidement des réponses aux questions les plus courantes 
            sur l'utilisation de DakarMarket.
          </p>
        </section>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-primary">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <section className="mt-16 text-center bg-muted rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Notre équipe support est là pour vous aider. N'hésitez pas à nous contacter 
            pour toute question spécifique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">
                Nous contacter
              </Button>
            </Link>
            <a
              href="https://wa.me/221755227006?text=Bonjour%2C%20j%27ai%20une%20question"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">DakarMarket</span>
          </div>
          <p className="text-muted-foreground">
            © 2025 DakarMarket. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}