"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, ChevronDown, ClipboardList, Shield, Users } from "lucide-react"
import { NavBar } from "../../nav-bar"
import { Testimonial } from "../../testimonial-card"
import { Footer } from "../../footer"
import { useState } from "react"

export function AuthScreen() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Comment sécurisez-vous les données médicales sensibles?",
      answer: "Nous utilisons un chiffrement de bout en bout et respectons les normes les plus strictes de sécurité des données de santé (HIPAA, RGPD). Toutes les données sont stockées sur des serveurs sécurisés en France."
    },
    {
      question: "Puis-je essayer la plateforme avant de m'engager?",
      answer: "Oui, nous offrons une période d'essai gratuit de 14 jours sans engagement. Vous pouvez tester toutes les fonctionnalités de la plateforme."
    },
    {
      question: "Quelle est la courbe d'apprentissage pour votre solution?",
      answer: "La plupart de nos utilisateurs maîtrisent les fonctionnalités principales en moins d'une journée. Nous fournissons également des formations sur mesure et une documentation complète."
    },
    {
      question: "Votre solution est-elle compatible avec les autres logiciels médicaux?",
      answer: "Oui, healthCare propose des API et des intégrations avec les principaux logiciels de gestion médicale et systèmes hospitaliers."
    }
  ];
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 lg:py-28 bg-gradient-to-b ">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4 order-2 lg:order-1">
                <div className="inline-block rounded-lg  px-3 py-1 text-sm text-blue-800 mb-4">
                  Gestion des dossiers médicaux
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-tight">
                  Simplifiez le suivi des dossiers médicaux de vos patients
                </h1>
                <p className="text-gray-500 md:text-lg lg:text-xl max-w-[600px]">
                  healthCare vous aide à gérer efficacement les dossiers médicaux, à améliorer la coordination des soins
                  et à offrir une meilleure expérience à vos patients.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-white">
                    Commencer gratuitement <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative aspect-square w-full max-w-[550px] mx-auto">
                  <Image
                    src="/images/img1.png"
                    alt="Dashboard Interface"
                    fill
                    className="rounded-lg shadow-xl object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20 lg:py-24">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-4xl mx-auto">
              <div className="space-y-2">
                <div className="inline-block rounded-lg px-3 py-1 text-sm text-blue-800">
                  Fonctionnalités
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Tout ce dont vous avez besoin pour gérer vos dossiers medicaux
                </h2>
                <p className="text-gray-500 md:text-lg">
                  Notre plateforme offre des outils puissants pour simplifier la gestion des dossiers médicaux dans
                  votre établissement.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-center gap-8 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="relative aspect-video w-full">
                <Image
                  src="/images/img2.jpeg"
                  alt="Application Features"
                  fill
                  className="mx-auto rounded-lg shadow-lg object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <ul className="grid gap-6">
                  <li className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold">Dossiers médicaux électroniques</h3>
                      <p className="text-gray-500">
                        Créez facilement un dossier médical électronique complet et sécurisé.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold">Suivi des traitements</h3>
                      <p className="text-gray-500">
                        Suivi des traitements et des médicaments prescrits pour chaque patient.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold">Rapports et analyses</h3>
                      <p className="text-gray-500">
                        Générez des rapports détaillés pour améliorer la prise de décision clinique.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 md:py-20 lg:py-24">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-4xl mx-auto">
              <div className="space-y-2">
                <div className="inline-block rounded-lg px-3 py-1 text-sm text-blue-800">Avantages</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Pourquoi choisir healthCare?</h2>
                <p className="text-gray-500 md:text-lg">
                  Notre solution apporte des bénéfices concrets aux établissements de santé et donc aux patients.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full  p-3">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-center">Organisation optimisée</h3>
                <p className="text-center text-gray-500">
                  Centralisez toutes les informations médicales pour un accès rapide et efficace.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border  p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full p-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-center">Sécurité renforcée</h3>
                <p className="text-center text-gray-500">
                  Protection des données sensibles avec des normes de sécurité élevées.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border  p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-center">Collaboration facilitée</h3>
                <p className="text-center text-gray-500">
                  Améliorez la communication entre les différents services de votre établissement.
                </p>
              </div>
            </div>
          </div>
        </section>

         <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Sections existantes (Hero, Features, Benefits) */}

        {/* Testimonials Section - Modifiée */}
        <section className="py-12 md:py-20 lg:py-24">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-4xl mx-auto">
              <div className="space-y-2">
                <div className="inline-block rounded-lg  px-3 py-1 text-sm text-blue-800">Témoignages</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ce que disent nos utilisateurs</h2>
                <p className="text-gray-500 md:text-lg">
                  Découvrez comment healthCare transforme la gestion des dossiers médicaux au Cameroun.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Testimonial
                name="Dr. Kamga Jean"
                role="Médecin Chef, Hôpital Central de Yaoundé"
                content="Depuis que nous utilisons healthCare, la gestion de nos dossiers patients est devenue beaucoup plus efficace. Nous gagnons un temps précieux que nous pouvons consacrer aux soins."
                rating={4.5}
              />
              <Testimonial
                name="Mme. Ngo Bassa"
                role="Directrice, Clinique La Paix, Douala"
                content="La plateforme est intuitive et a considérablement amélioré notre organisation. Nos équipes médicales peuvent accéder rapidement aux informations dont elles ont besoin."
                rating={5}
              />
              <Testimonial
                name="Dr. Fouda Michel"
                role="Cardiologue, Clinique Saint Jean, Bafoussam"
                content="healthCare a révolutionné ma pratique quotidienne. Le suivi des patients est simplifié et la coordination avec mes collègues est optimale."
                rating={4}
              />
              {/* Nouveaux témoignages */}
              <Testimonial
                name="Dr. Amina Ousman"
                role="Pédiatre, Centre Médical de Garoua"
                content="La gestion des dossiers pédiatriques est devenue un jeu d'enfant. Je recommande vivement cette solution à tous mes confrères."
                rating={4.5}
              />
              <Testimonial
                name="Dr. Lionel Mba"
                role="Chirurgien, Hôpital Général de Douala"
                content="L'accès aux antécédents médicaux en salle d'opération a considérablement amélioré notre sécurité per-opératoire."
                rating={5}
              />
            </div>
          </div>
        </section>

        {/* Nouvelle section FAQ */}
        <section className="py-12 md:py-20 lg:py-24 ">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-4xl mx-auto">
              <div className="space-y-2">
                <div className="inline-block rounded-lg  px-3 py-1 text-sm text-blue-800">FAQ</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Questions fréquentes</h2>
                <p className="text-gray-500 md:text-lg">
                  Trouvez des réponses aux questions les plus courantes sur notre plateforme.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-4xl py-12">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white text-white">
                    <button
                      className="flex items-center justify-between w-full p-6 text-left"
                      onClick={() => toggleFaq(index)}
                    >
                      <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-500 transition-transform ${openFaqIndex === index ? 'transform rotate-180' : ''}`}
                      />
                    </button>
                    {openFaqIndex === index && (
                      <div className="p-6 pt-0 text-gray-600">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section existante */}
      </main>
    </div>

        {/* CTA Section */}
        <section className="py-12 md:py-20 lg:py-24 bg-blue-600 text-white">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-4xl mx-auto">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Prêt à transformer la gestion de vos dossiers médicaux?
                </h2>
                <p className="text-blue-100 md:text-lg">
                  Rejoignez les établissements de santé qui font confiance à healthCare pour améliorer leur efficacité.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                  Commencer gratuitement
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-700 w-full sm:w-auto">
                  Contacter l'équipe commerciale
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}