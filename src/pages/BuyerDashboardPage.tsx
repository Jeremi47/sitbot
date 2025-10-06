import { useState, useEffect } from 'react';
import { Download, Star, Heart, Package, CreditCard, MessageSquare } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Order, Product } from '../lib/supabase';

export default function BuyerDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('purchases');
  const [orders, setOrders] = useState<(Order & { product: Product })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          product:products(*)
        `)
        .eq('buyer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data as any || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Mon compte</h1>
          <p className="text-[#9CA3AF]">Gérez vos achats et paramètres</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#E6F0FF] rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-[#0066FF]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1A1A1A]">{orders.length}</div>
                <div className="text-sm text-[#9CA3AF]">Achats</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1A1A1A]">
                  {orders.reduce((sum, order) => sum + parseFloat(order.amount.toString()), 0).toFixed(2)}€
                </div>
                <div className="text-sm text-[#9CA3AF]">Total dépensé</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#EF4444]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1A1A1A]">8</div>
                <div className="text-sm text-[#9CA3AF]">Favoris</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1A1A1A]">2</div>
                <div className="text-sm text-[#9CA3AF]">Tickets ouverts</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <aside className="lg:col-span-1">
            <Card>
              <nav className="space-y-1">
                {[
                  { id: 'purchases', label: 'Mes achats', icon: Package },
                  { id: 'favorites', label: 'Favoris', icon: Heart },
                  { id: 'support', label: 'Support', icon: MessageSquare }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-[#E6F0FF] text-[#0066FF]'
                          : 'text-[#4A4A4A] hover:bg-[#F9FAFB]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </aside>

          <main className="lg:col-span-4">
            {activeTab === 'purchases' && (
              <Card>
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Mes achats</h2>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-[#E5E7EB] rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                      Aucun achat pour le moment
                    </h3>
                    <p className="text-[#9CA3AF] mb-6">
                      Découvrez nos produits et commencez votre collection
                    </p>
                    <Button>Explorer le catalogue</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div
                        key={order.id}
                        className="flex items-center gap-4 p-4 border border-[#E5E7EB] rounded-lg hover:border-[#0066FF] transition-colors"
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-[#E5E7EB] to-[#9CA3AF] rounded-lg flex-shrink-0">
                          {order.product?.image_url ? (
                            <img
                              src={order.product.image_url}
                              alt={order.product.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              🤖
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1A1A1A] mb-1">
                            {order.product?.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-[#9CA3AF]">
                            <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                            <span className="px-2 py-1 bg-[#D1FAE5] text-[#065F46] rounded text-xs font-semibold">
                              {order.status === 'completed' ? 'Complété' : 'En attente'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold text-[#1A1A1A] mb-2">
                            {order.amount}€
                          </div>
                          <div className="flex gap-2">
                            <Button size="small">
                              <Download className="w-4 h-4" />
                              Télécharger
                            </Button>
                            <Button size="small" variant="secondary">
                              Voir
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {activeTab === 'favorites' && (
              <Card>
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Mes favoris</h2>
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                    Aucun favori
                  </h3>
                  <p className="text-[#9CA3AF]">
                    Ajoutez des produits à vos favoris pour les retrouver facilement
                  </p>
                </div>
              </Card>
            )}

            {activeTab === 'support' && (
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#1A1A1A]">Support</h2>
                  <Button size="small">Nouveau ticket</Button>
                </div>
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                    Aucun ticket
                  </h3>
                  <p className="text-[#9CA3AF]">
                    Besoin d'aide ? Créez un ticket de support
                  </p>
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
