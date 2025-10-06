import { Bot, Chrome, Twitch, TrendingUp, Shield, Zap, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/ProductCard';
import type { Product } from '../lib/supabase';

const featuredProducts: Product[] = [
  {
    id: '1',
    seller_id: '1',
    title: 'Bot Modération Pro',
    subtitle: 'Système de modération automatique complet',
    description: 'Bot Discord avec modération avancée',
    category: 'discord',
    price: 29.99,
    image_url: '',
    gallery_urls: [],
    version: '2.1.0',
    status: 'published',
    downloads: 1250,
    sales: 1250,
    rating_avg: 4.8,
    rating_count: 234,
    tags: ['modération', 'discord', 'automod'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    seller_id: '2',
    title: 'Productivity Booster',
    subtitle: 'Extension Chrome pour optimiser votre workflow',
    description: 'Extension Chrome complète',
    category: 'chrome',
    price: 19.99,
    image_url: '',
    gallery_urls: [],
    version: '1.5.0',
    status: 'published',
    downloads: 890,
    sales: 890,
    rating_avg: 4.6,
    rating_count: 167,
    tags: ['productivité', 'chrome', 'workflow'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    seller_id: '3',
    title: 'Stream Alerts Plus',
    subtitle: 'Système d\'alertes personnalisées pour Twitch',
    description: 'Alertes Twitch customisables',
    category: 'twitch',
    price: 24.99,
    image_url: '',
    gallery_urls: [],
    version: '3.0.0',
    status: 'published',
    downloads: 2100,
    sales: 2100,
    rating_avg: 4.9,
    rating_count: 412,
    tags: ['twitch', 'streaming', 'alertes'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function HomePage() {
  return (
    <div>
      <section className="relative bg-gradient-to-br from-[#0066FF] via-[#4A66F0] to-[#8B5CF6] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Scripts & Bots,<br />Simplified
              </h1>
              <p className="text-xl text-blue-100">
                Achetez et vendez des bots Discord, extensions Chrome et scripts Twitch.
                La marketplace des développeurs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="large" className="bg-white text-[#0066FF] hover:bg-gray-100">
                  Explorer les produits
                </Button>
                <Button size="large" variant="secondary" className="border-white text-white hover:bg-white/10">
                  Commencer à vendre
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold">1,500+</div>
                  <div className="text-blue-200 text-sm">Produits</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">10,000+</div>
                  <div className="text-blue-200 text-sm">Utilisateurs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">250+</div>
                  <div className="text-blue-200 text-sm">Vendeurs</div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full h-96">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform rotate-6 hover:rotate-3 transition-transform">
                  <Bot className="w-16 h-16 mb-4" />
                  <div className="text-lg font-semibold">Bot Discord</div>
                  <div className="text-sm text-blue-200">Modération avancée</div>
                </div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform -rotate-6 hover:-rotate-3 transition-transform">
                  <Chrome className="w-16 h-16 mb-4" />
                  <div className="text-lg font-semibold">Extension Chrome</div>
                  <div className="text-sm text-blue-200">Productivité boost</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Explorez par catégorie
            </h2>
            <p className="text-lg text-[#9CA3AF]">
              Trouvez exactement ce dont vous avez besoin
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <a href="/discord" className="group">
              <div className="bg-gradient-to-br from-[#4A66F0] to-[#3651D9] text-white p-8 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
                <Bot className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Bots Discord</h3>
                <p className="text-blue-100 mb-4">
                  Automatisez votre serveur avec des bots puissants
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>Explorer</span>
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
            </a>

            <a href="/chrome" className="group">
              <div className="bg-gradient-to-br from-[#34A853] to-[#2D8E47] text-white p-8 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
                <Chrome className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Extensions Chrome</h3>
                <p className="text-green-100 mb-4">
                  Boostez votre productivité avec des extensions
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>Explorer</span>
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
            </a>

            <a href="/twitch" className="group">
              <div className="bg-gradient-to-br from-[#9D00E8] to-[#7B00B4] text-white p-8 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
                <Twitch className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Outils Twitch</h3>
                <p className="text-purple-100 mb-4">
                  Engagez votre audience comme jamais
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>Explorer</span>
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">
                Produits populaires
              </h2>
              <p className="text-[#9CA3AF]">Les meilleures ventes de la semaine</p>
            </div>
            <Button variant="secondary">Voir tout</Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Pourquoi choisir Botscript ?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#E6F0FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#0066FF]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                100% Sécurisé
              </h3>
              <p className="text-[#9CA3AF]">
                Tous les paiements sont cryptés et sécurisés. Protection des acheteurs garantie.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#E6F0FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-[#0066FF]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                Téléchargement instantané
              </h3>
              <p className="text-[#9CA3AF]">
                Accédez immédiatement à vos achats après le paiement. Pas d'attente.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#E6F0FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#0066FF]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                Support inclus
              </h3>
              <p className="text-[#9CA3AF]">
                Assistance technique des vendeurs et équipe support dédiée.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#0066FF] to-[#8B5CF6] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des milliers de développeurs et créateurs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="large" className="bg-white text-[#0066FF] hover:bg-gray-100">
              Acheter maintenant
            </Button>
            <Button size="large" variant="secondary" className="border-white text-white hover:bg-white/10">
              Devenir vendeur
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
