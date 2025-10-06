import { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { supabase, Product } from '../lib/supabase';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'published');

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (sortBy === 'price-asc') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price-desc') {
        query = query.order('price', { ascending: false });
      } else if (sortBy === 'rating') {
        query = query.order('rating_avg', { ascending: false });
      } else if (sortBy === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('sales', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">Catalogue</h1>
          <p className="text-[#9CA3AF]">
            Découvrez {filteredProducts.length} produits disponibles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#1A1A1A]">Filtres</h2>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange([0, 100]);
                    setSearchTerm('');
                  }}
                  className="text-sm text-[#0066FF] hover:underline"
                >
                  Réinitialiser
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-[#1A1A1A] mb-3">Catégorie</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'Toutes' },
                      { value: 'discord', label: 'Bots Discord' },
                      { value: 'chrome', label: 'Extensions Chrome' },
                      { value: 'twitch', label: 'Outils Twitch' }
                    ].map(cat => (
                      <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={cat.value}
                          checked={selectedCategory === cat.value}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="text-[#0066FF]"
                        />
                        <span className="text-sm text-[#4A4A4A]">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1A1A1A] mb-3">Prix</h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-[#9CA3AF]">
                      <span>0€</span>
                      <span>{priceRange[1]}€</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1A1A1A] mb-3">Note minimum</h3>
                  <div className="space-y-2">
                    {[5, 4, 3].map(rating => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded text-[#0066FF]" />
                        <span className="text-sm text-[#4A4A4A]">
                          {rating}+ étoiles
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden px-4 py-2 border border-[#E5E7EB] rounded-lg flex items-center gap-2 hover:bg-[#F9FAFB]"
                  >
                    <Filter className="w-5 h-5" />
                    Filtres
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="popular">Plus populaire</option>
                    <option value="recent">Plus récent</option>
                    <option value="rating">Mieux notés</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-[#E5E7EB] animate-pulse">
                    <div className="aspect-video bg-[#E5E7EB] rounded-lg mb-4"></div>
                    <div className="h-6 bg-[#E5E7EB] rounded mb-2"></div>
                    <div className="h-4 bg-[#E5E7EB] rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-[#9CA3AF]">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
