import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#8B5CF6] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-2xl font-bold">Botscript</span>
            </div>
            <p className="text-[#9CA3AF] text-sm">
              La marketplace des développeurs. Achetez et vendez des bots, extensions et scripts.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-[#9CA3AF] hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#9CA3AF] hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#9CA3AF] hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#9CA3AF] hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Produits</h3>
            <ul className="space-y-2 text-[#9CA3AF] text-sm">
              <li>
                <a href="/discord" className="hover:text-white transition-colors">
                  Bots Discord
                </a>
              </li>
              <li>
                <a href="/chrome" className="hover:text-white transition-colors">
                  Extensions Chrome
                </a>
              </li>
              <li>
                <a href="/twitch" className="hover:text-white transition-colors">
                  Outils Twitch
                </a>
              </li>
              <li>
                <a href="/catalog" className="hover:text-white transition-colors">
                  Tous les produits
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2 text-[#9CA3AF] text-sm">
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="hover:text-white transition-colors">
                  Comment ça marche
                </a>
              </li>
              <li>
                <a href="/sell" className="hover:text-white transition-colors">
                  Devenir vendeur
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-[#9CA3AF] text-sm">
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white transition-colors">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="/legal" className="hover:text-white transition-colors">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="/refund" className="hover:text-white transition-colors">
                  Politique de remboursement
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#4A4A4A] mt-8 pt-8 text-center text-[#9CA3AF] text-sm">
          <p>&copy; {new Date().getFullYear()} Botscript. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
