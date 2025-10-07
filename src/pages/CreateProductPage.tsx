import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function CreateProductPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'discord',
    price: '',
    version: '1.0.0',
    tags: '',
    imageUrl: '',
    fileUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const { error: insertError } = await supabase
        .from('products')
        .insert({
          seller_id: user?.id,
          title: formData.title,
          subtitle: formData.subtitle,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          version: formData.version,
          tags: tagsArray,
          image_url: formData.imageUrl || null,
          file_url: formData.fileUrl || null,
          status: 'published'
        });

      if (insertError) throw insertError;

      navigate('/dashboard/seller');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-gradient-to-r from-[#0066FF] to-[#8B5CF6] text-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/dashboard/seller')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au dashboard
          </button>
          <h1 className="text-3xl font-bold mb-2">Nouveau produit</h1>
          <p className="text-blue-100">Ajoutez un nouveau bot, plugin ou extension</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Informations générales</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Titre <span className="text-[#EF4444]">*</span>
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Mon super bot Discord"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Sous-titre
                  </label>
                  <Input
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    placeholder="Une description courte et accrocheuse"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Description <span className="text-[#EF4444]">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez votre produit en détail..."
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                      Catégorie <span className="text-[#EF4444]">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 outline-none transition-all bg-white"
                    >
                      <option value="discord">Discord Bot</option>
                      <option value="chrome">Extension Chrome</option>
                      <option value="twitch">Extension Twitch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                      Prix (€) <span className="text-[#EF4444]">*</span>
                    </label>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="9.99"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Version
                  </label>
                  <Input
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    placeholder="1.0.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Tags
                  </label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="modération, fun, utilitaire (séparés par des virgules)"
                  />
                  <p className="text-sm text-[#9CA3AF] mt-1">
                    Séparez les tags par des virgules
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Médias et fichiers</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Image de couverture (URL)
                  </label>
                  <Input
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://images.pexels.com/..."
                  />
                  <p className="text-sm text-[#9CA3AF] mt-1">
                    Utilisez une image de Pexels ou un lien direct
                  </p>
                  {formData.imageUrl && (
                    <div className="mt-3 relative w-full h-48 bg-[#E5E7EB] rounded-lg overflow-hidden">
                      <img
                        src={formData.imageUrl}
                        alt="Aperçu"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Fichier du produit (URL)
                  </label>
                  <Input
                    name="fileUrl"
                    value={formData.fileUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                  />
                  <p className="text-sm text-[#9CA3AF] mt-1">
                    Lien vers le fichier téléchargeable (GitHub, stockage cloud, etc.)
                  </p>
                </div>
              </div>
            </Card>

            {error && (
              <div className="bg-[#FEE2E2] border border-[#EF4444] text-[#DC2626] px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/seller')}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Publier le produit'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
