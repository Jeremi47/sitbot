import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Product } from '../lib/supabase';

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProduct();
  }, [id, user]);

  const loadProduct = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        navigate('/catalog');
        return;
      }

      setProduct(data);
    } catch (err) {
      console.error('Error loading product:', err);
      navigate('/catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (e.target.name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }

    if (e.target.name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }

    if (e.target.name === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 3) return;
    }

    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  };

  const generateLicenseKey = () => {
    const segments = [];
    for (let i = 0; i < 4; i++) {
      segments.push(Math.random().toString(36).substring(2, 7).toUpperCase());
    }
    return segments.join('-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !user) return;

    setError('');
    setProcessing(true);

    try {
      const orderNumber = generateOrderNumber();
      const commission = parseFloat((parseFloat(product.price.toString()) * 0.1).toFixed(2));

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          seller_id: product.seller_id,
          product_id: product.id,
          order_number: orderNumber,
          amount: parseFloat(product.price.toString()),
          commission: commission,
          status: 'completed',
          stripe_payment_id: `sim_${Date.now()}`
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const licenseKey = generateLicenseKey();
      const { error: licenseError } = await supabase
        .from('licenses')
        .insert({
          order_id: orderData.id,
          product_id: product.id,
          buyer_id: user.id,
          license_key: licenseKey,
          activations_limit: 1
        });

      if (licenseError) throw licenseError;

      const { error: updateError } = await supabase
        .from('products')
        .update({
          sales: product.sales + 1,
          downloads: product.downloads + 1
        })
        .eq('id', product.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/buyer');
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du paiement');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0066FF] border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-[#00D980]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Paiement réussi</h2>
            <p className="text-[#4A4A4A] mb-6">
              Votre achat a été confirmé. Vous allez être redirigé vers votre dashboard...
            </p>
            <Button onClick={() => navigate('/dashboard/buyer')} className="w-full">
              Accéder à mes achats
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#0066FF] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au produit
        </button>

        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Finaliser votre achat</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-[#00D980]" />
                <h2 className="text-xl font-bold text-[#1A1A1A]">Paiement sécurisé</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Numéro de carte <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Nom du titulaire <span className="text-[#EF4444]">*</span>
                  </label>
                  <Input
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                      Date d'expiration <span className="text-[#EF4444]">*</span>
                    </label>
                    <Input
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/AA"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                      CVV <span className="text-[#EF4444]">*</span>
                    </label>
                    <Input
                      name="cvv"
                      type="password"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-[#FEE2E2] border border-[#EF4444] text-[#DC2626] px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="bg-[#F9FAFB] rounded-lg p-4">
                  <p className="text-sm text-[#4A4A4A] mb-2">
                    En effectuant cet achat, vous acceptez nos conditions générales de vente.
                  </p>
                  <p className="text-sm text-[#9CA3AF]">
                    Paiement sécurisé par cryptage SSL. Vos informations sont protégées.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="large"
                  disabled={processing}
                >
                  {processing ? 'Traitement en cours...' : `Payer ${product.price}€`}
                </Button>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="font-bold text-[#1A1A1A] mb-4">Résumé de la commande</h3>

              <div className="flex gap-3 pb-4 border-b border-[#E5E7EB] mb-4">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-[#E5E7EB] rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1A1A1A] mb-1">{product.title}</h4>
                  <p className="text-sm text-[#9CA3AF]">{product.category}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Prix du produit</span>
                  <span className="font-semibold text-[#1A1A1A]">{product.price}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Taxes incluses</span>
                  <span className="font-semibold text-[#1A1A1A]">0€</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1A1A1A]">Total</span>
                  <span className="text-2xl font-bold text-[#0066FF]">{product.price}€</span>
                </div>
              </div>
            </Card>

            <Card className="bg-[#E6F0FF] border-[#0066FF]/20">
              <div className="flex gap-3">
                <Lock className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#1A1A1A] mb-1">Achat sécurisé</h4>
                  <p className="text-sm text-[#4A4A4A]">
                    Vos informations de paiement sont cryptées et sécurisées. Nous ne stockons pas vos données bancaires.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
