import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Download, Heart, Shield, Clock, Tag, CheckCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { supabase, Product, Review, Profile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!user || !product) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: product.id });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/checkout/${product?.id}`);
  };

  const loadProduct = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .maybeSingle();

      if (productsData) {
        setProduct(productsData);

        const { data: sellerData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', productsData.seller_id)
          .maybeSingle();

        setSeller(sellerData);

        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productsData.id)
          .order('created_at', { ascending: false });

        setReviews(reviewsData || []);

        if (user) {
          const { data: favoriteData } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', user.id)
            .eq('product_id', productsData.id)
            .maybeSingle();

          setIsFavorite(!!favoriteData);
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0066FF] border-t-transparent"></div>
      </div>
    );
  }

  const categoryColors = {
    discord: 'bg-[#4A66F0]',
    chrome: 'bg-[#34A853]',
    twitch: 'bg-[#9D00E8]'
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#0066FF] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="aspect-video bg-gradient-to-br from-[#E5E7EB] to-[#9CA3AF] rounded-lg overflow-hidden mb-4">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl">🤖</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-24 h-24 bg-[#E5E7EB] rounded-lg flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-[#0066FF] transition-all"
                  ></div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex border-b border-[#E5E7EB] mb-6">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'features', label: 'Caractéristiques' },
                  { id: 'changelog', label: 'Changelog' },
                  { id: 'reviews', label: `Avis (${reviews.length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-[#0066FF] border-b-2 border-[#0066FF]'
                        : 'text-[#9CA3AF] hover:text-[#4A4A4A]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div>
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-[#4A4A4A] leading-relaxed">{product.description}</p>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="space-y-3">
                    {['Modération automatique', 'Système de logs avancé', 'Commandes personnalisables', 'Support multi-serveurs', 'Mises à jour automatiques'].map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#00D980] mt-0.5" />
                        <span className="text-[#4A4A4A]">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'changelog' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-[#1A1A1A]">Version {product.version}</span>
                        <span className="text-sm text-[#9CA3AF]">- 2 mars 2025</span>
                      </div>
                      <ul className="list-disc list-inside text-[#4A4A4A] space-y-1 ml-4">
                        <li>Amélioration des performances</li>
                        <li>Correction de bugs mineurs</li>
                        <li>Nouvelle interface de configuration</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-[#9CA3AF]">Aucun avis pour le moment</p>
                      </div>
                    ) : (
                      reviews.map(review => (
                        <div key={review.id} className="border-b border-[#E5E7EB] pb-6 last:border-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#E5E7EB]'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-semibold text-[#1A1A1A]">Acheteur vérifié</span>
                          </div>
                          {review.title && (
                            <h4 className="font-semibold text-[#1A1A1A] mb-2">{review.title}</h4>
                          )}
                          <p className="text-[#4A4A4A] mb-2">{review.comment}</p>
                          <div className="flex items-center gap-4 text-sm text-[#9CA3AF]">
                            <span>{new Date(review.created_at).toLocaleDateString('fr-FR')}</span>
                            <button className="hover:text-[#0066FF]">Utile ({review.helpful_count})</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${categoryColors[product.category]}`}>
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </span>
                {product.sales > 100 && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F59E0B] text-white">
                    Best-seller
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">{product.title}</h1>
              {product.subtitle && (
                <p className="text-[#9CA3AF] mb-4">{product.subtitle}</p>
              )}

              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating_avg) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#E5E7EB]'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-[#1A1A1A]">{product.rating_avg.toFixed(1)}</span>
                <span className="text-[#9CA3AF]">({product.rating_count} avis)</span>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-[#0066FF]">{product.price}€</span>
                <span className="text-[#9CA3AF] line-through">49.99€</span>
              </div>

              <div className="space-y-3 mb-6">
                <Button className="w-full" size="large" onClick={handleBuyNow}>
                  Acheter maintenant
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  size="large"
                  onClick={handleToggleFavorite}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#EF4444] text-[#EF4444]' : ''}`} />
                  {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </Button>
              </div>

              <div className="space-y-3 pt-6 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-3 text-sm">
                  <Download className="w-5 h-5 text-[#9CA3AF]" />
                  <span className="text-[#4A4A4A]">
                    <strong>{product.sales}</strong> ventes
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-[#9CA3AF]" />
                  <span className="text-[#4A4A4A]">Téléchargement instantané</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-5 h-5 text-[#9CA3AF]" />
                  <span className="text-[#4A4A4A]">Garantie 14 jours</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Tag className="w-5 h-5 text-[#9CA3AF]" />
                  <span className="text-[#4A4A4A]">Version {product.version}</span>
                </div>
              </div>
            </Card>

            {seller && (
              <Card>
                <h3 className="font-bold text-[#1A1A1A] mb-4">À propos du vendeur</h3>
                <div className="flex items-center gap-3 mb-4">
                  {seller.avatar_url ? (
                    <img
                      src={seller.avatar_url}
                      alt={seller.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0066FF] to-[#8B5CF6] rounded-full flex items-center justify-center text-white font-bold">
                      {seller.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">{seller.username}</div>
                    {seller.is_verified && (
                      <div className="text-sm text-[#00D980]">Vendeur vérifié</div>
                    )}
                  </div>
                </div>
                {seller.bio && (
                  <p className="text-sm text-[#4A4A4A] mb-4">{seller.bio}</p>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
