import Link from "next/link"
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-cyan-600 font-bold text-lg">V</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Vlar</h3>
                <p className="text-sm text-cyan-100">Tecnologia & Vape</p>
              </div>
            </div>
            <p className="text-cyan-100 text-sm">
              Sua loja online de confiança para vaporizadores, eletrônicos e informática. Qualidade garantida e entrega
              rápida.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-cyan-100 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-cyan-100 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-cyan-100 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Departamentos */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Departamentos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categoria/vaporizadores" className="text-cyan-100 hover:text-white transition-colors">
                  Vaporizadores
                </Link>
              </li>
              <li>
                <Link href="/categoria/liquidos" className="text-cyan-100 hover:text-white transition-colors">
                  Líquidos
                </Link>
              </li>
              <li>
                <Link href="/categoria/reposicao" className="text-cyan-100 hover:text-white transition-colors">
                  Reposição
                </Link>
              </li>
              <li>
                <Link href="/categoria/eletronicos" className="text-cyan-100 hover:text-white transition-colors">
                  Eletrônicos
                </Link>
              </li>
              <li>
                <Link href="/categoria/informatica" className="text-cyan-100 hover:text-white transition-colors">
                  Informática
                </Link>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Atendimento</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contato" className="text-cyan-100 hover:text-white transition-colors">
                  Fale Conosco
                </Link>
              </li>
              <li>
                <Link href="/meus-pedidos" className="text-cyan-100 hover:text-white transition-colors">
                  Meus Pedidos
                </Link>
              </li>
              <li>
                <Link href="/perfil" className="text-cyan-100 hover:text-white transition-colors">
                  Minha Conta
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidade" className="text-cyan-100 hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos-uso" className="text-cyan-100 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contato</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-cyan-200" />
                <span className="text-cyan-100">(33) 99834-3132</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-200" />
                <span className="text-cyan-100">contato@vlar.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-200" />
                <span className="text-cyan-100">Governador Valadares - MG</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-200" />
                <div className="text-cyan-100">
                  <div>Seg-Sex: 8h às 18h</div>
                  <div>Sábado: 8h às 12h</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formas de Pagamento */}
        <div className="border-t border-cyan-400 mt-8 pt-8">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold mb-4">Formas de Pagamento</h4>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <img src="/payment-icons/visa.png" alt="Visa" className="h-8 bg-white rounded p-1" />
              <img src="/payment-icons/mastercard.png" alt="Mastercard" className="h-8 bg-white rounded p-1" />
              <img src="/payment-icons/amex.png" alt="American Express" className="h-8 bg-white rounded p-1" />
              <img src="/payment-icons/elo.png" alt="Elo" className="h-8 bg-white rounded p-1" />
              <img src="/payment-icons/pix.png" alt="PIX" className="h-8 bg-white rounded p-1" />
              <img src="/payment-icons/boleto.png" alt="Boleto" className="h-8 bg-white rounded p-1" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-cyan-400 pt-6 text-center text-sm text-cyan-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p>&copy; 2024 Vlar - Tecnologia & Vape. Todos os direitos reservados.</p>
              <p className="mt-1">CNPJ: 61.249.131/0001-00</p>
            </div>
            <div className="text-xs">
              <p>🚚 Frete grátis para compras acima de R$ 299</p>
              <p>🔒 Compra 100% segura e protegida</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
