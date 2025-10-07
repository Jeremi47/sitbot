import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Package, DollarSign, Star, CreditCard as Edit, Trash2, Eye, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Product } from '../lib/supabase';

export default function SellerDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    avgRating: 0,
    productsCount: 0
  });

  useEffect(() => {
    if (user) {
      loadProducts();
      loadStats();
    }
  }, [user]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user?.id);

      if (productsData) {
        const totalSales = productsData.reduce((sum, p) => sum + p.sales, 0);
        const totalRevenue = productsData.reduce((sum, p) => sum + (p.sales * parseFloat(p.price.toString())), 0);
        const avgRating = productsData.length > 0
          ? productsData.reduce((sum, p) => sum + p.rating_avg, 0) / productsData.length
          : 0;

        setStats({
          totalRevenue,
          totalSales,
          avgRating,
          productsCount: productsData.length
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-gradient-to-r from-[#0066FF] to-[#8B5CF6] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Vendeur</h1>
          <p className="text-blue-100">Gérez vos produits et suivez vos performances</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#DCFCE7] rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#00D980]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1A1A1A]">
                  {stats.totalRevenue.toFixed(2)}€
                </div>
                <div className="text-sm text-[#9CA3AF]">Revenus totaux</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#E6F0FF] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#0066FF]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1A1A1A]">{stats.totalSales}</div>
                <div className="text-sm text-[#9CA3AF]">Ventes totales</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1A1A1A]">
                  {stats.avgRating.toFixed(1)}
                </div>
                <div className="text-sm text-[#9CA3AF]">Note moyenne</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F3E8FF] rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1A1A1A]">{stats.productsCount}</div>
                <div className="text-sm text-[#9CA3AF]">Produits</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <aside className="lg:col-span-1">
            <Card>
              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
                  { id: 'products', label: 'Mes produits', icon: Package },
                  { id: 'sales', label: 'Ventes', icon: DollarSign },
                  { id: 'reviews', label: 'Avis', icon: Star }
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
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card>
                  <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Aperçu des performances</h2>
                  <div className="h-64 bg-[#F9FAFB] rounded-lg flex items-center justify-center">
                    <p className="text-[#9CA3AF]">Graphique des ventes (Chart.js)</p>
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Produits les plus vendus</h2>
                  <div className="space-y-3">
                    {products.slice(0, 5).map((product, index) => (
                      <div key={product.id} className="flex items-center gap-4 p-3 bg-[#F9FAFB] rounded-lg">
                        <span className="text-2xl font-bold text-[#9CA3AF]">#{index + 1}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-[#1A1A1A]">{product.title}</div>
                          <div className="text-sm text-[#9CA3AF]">{product.sales} ventes</div>
                        </div>
                        <div className="text-xl font-bold text-[#0066FF]">
                          {(product.sales * parseFloat(product.price.toString())).toFixed(2)}€
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'products' && (
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#1A1A1A]">Mes produits</h2>
                  <Button onClick={() => navigate('/dashboard/seller/create')}>
                    <Plus className="w-5 h-5" />
                    Nouveau produit
                  </Button>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-[#E5E7EB] rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                      Aucun produit
                    </h3>
                    <p className="text-[#9CA3AF] mb-6">
                      Commencez par créer votre premier produit
                    </p>
                    <Button onClick={() => navigate('/dashboard/seller/create')}>
                      <Plus className="w-5 h-5" />
                      Créer un produit
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A]">Produit</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A]">Prix</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A]">Ventes</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A]">Note</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A]">Statut</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-[#1A1A1A]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E7EB]">
                        {products.map(product => (
                          <tr key={product.id} className="hover:bg-[#F9FAFB]">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#E5E7EB] rounded-lg flex-shrink-0"></div>
                                <div>
                                  <div className="font-semibold text-[#1A1A1A]">{product.title}</div>
                                  <div className="text-sm text-[#9CA3AF]">{product.category}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-[#1A1A1A] font-semibold">{product.price}€</td>
                            <td className="px-4 py-4 text-[#1A1A1A]">{product.sales}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                                <span className="text-[#1A1A1A]">{product.rating_avg.toFixed(1)}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                product.status === 'published'
                                  ? 'bg-[#D1FAE5] text-[#065F46]'
                                  : product.status === 'pending'
                                  ? 'bg-[#FEF3C7] text-[#92400E]'
                                  : 'bg-[#E5E7EB] text-[#4A4A4A]'
                              }`}>
                                {product.status === 'published' ? 'Publié' :
                                 product.status === 'pending' ? 'En attente' : 'Brouillon'}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button className="p-2 text-[#0066FF] hover:bg-[#E6F0FF] rounded-lg">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-[#0066FF] hover:bg-[#E6F0FF] rounded-lg">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}

            {activeTab === 'sales' && (
              <Card>
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Mes ventes</h2>
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                    Aucune vente
                  </h3>
                  <p className="text-[#9CA3AF]">
                    Vos ventes apparaîtront ici
                  </p>
                </div>
              </Card>
            )}

            {activeTab === 'reviews' && (
              <Card>
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Avis reçus</h2>
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                    Aucun avis
                  </h3>
                  <p className="text-[#9CA3AF]">
                    Les avis de vos clients apparaîtront ici
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
