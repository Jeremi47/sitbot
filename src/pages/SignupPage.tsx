import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { UserPlus } from 'lucide-react';

export default function SignupPage() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState<'buyer' | 'seller'>('buyer');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (!acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, username, userType);

    if (error) {
      if (error.message.includes('already registered')) {
        setError('Cet email est déjà utilisé');
      } else {
        setError('Une erreur est survenue lors de l\'inscription');
      }
    } else {
      window.location.href = '/';
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#0066FF] to-[#8B5CF6] rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Inscription</h1>
          <p className="text-[#9CA3AF]">Créez votre compte Botscript</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-[#FEE2E2] border border-[#EF4444] rounded-lg text-[#EF4444] text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
                Type de compte <span className="text-[#EF4444]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUserType('buyer')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    userType === 'buyer'
                      ? 'border-[#0066FF] bg-[#E6F0FF] text-[#0066FF]'
                      : 'border-[#E5E7EB] hover:border-[#9CA3AF]'
                  }`}
                >
                  <div className="font-semibold">Acheteur</div>
                  <div className="text-xs mt-1">J'achète des produits</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('seller')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    userType === 'seller'
                      ? 'border-[#0066FF] bg-[#E6F0FF] text-[#0066FF]'
                      : 'border-[#E5E7EB] hover:border-[#9CA3AF]'
                  }`}
                >
                  <div className="font-semibold">Vendeur</div>
                  <div className="text-xs mt-1">Je vends des produits</div>
                </button>
              </div>
            </div>

            <Input
              label="Nom d'utilisateur"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john_doe"
              required
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 rounded border-[#E5E7EB]"
              />
              <span className="text-sm text-[#4A4A4A]">
                J'accepte les{' '}
                <a href="/terms" className="text-[#0066FF] hover:underline">
                  conditions d'utilisation
                </a>{' '}
                et la{' '}
                <a href="/privacy" className="text-[#0066FF] hover:underline">
                  politique de confidentialité
                </a>
              </span>
            </label>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </Button>

            <div className="text-center text-sm text-[#9CA3AF]">
              Déjà un compte ?{' '}
              <a href="/login" className="text-[#0066FF] hover:underline font-semibold">
                Se connecter
              </a>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
