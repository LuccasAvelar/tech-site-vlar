"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">V</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Vlar</h3>
                <p className="text-blue-200 text-sm">Vaporizadores & Tecnologia</p>
              </div>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Os melhores vaporizadores, líquidos e produtos de tecnologia com qualidade garantida e entrega rápida.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Departamentos */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Departamentos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/categoria/vaporizadores"
                  className="text-blue-200 hover:text-white transition-colors text-sm"
                >
                  Vaporizadores
                </Link>
              </li>
              <li>
                <Link href="/categoria/liquidos" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Líquidos
                </Link>
              </li>
              <li>
                <Link href="/categoria/reposicao" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Reposição
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/eletronicos"
                  className="text-blue-200 hover:text-white transition-colors text-sm"
                >
                  Eletrônicos
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/informatica"
                  className="text-blue-200 hover:text-white transition-colors text-sm"
                >
                  Informática
                </Link>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Atendimento</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contato" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Fale Conosco
                </Link>
              </li>
              <li>
                <Link href="/meus-pedidos" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Meus Pedidos
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidade" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos-uso" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/trocas-devolucoes" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Trocas e Devoluções
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-200" />
                <span className="text-blue-100 text-sm">(33) 99834-3132</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-200" />
                <span className="text-blue-100 text-sm">contato@vlar.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-200 mt-0.5" />
                <span className="text-blue-100 text-sm">Minas Gerais, Brasil</span>
              </div>
            </div>
            <div className="bg-blue-700 rounded-lg p-3">
              <p className="text-blue-100 text-xs font-medium">🚚 Frete Grátis</p>
              <p className="text-blue-200 text-xs">Acima de R$ 199,00</p>
            </div>
          </div>
        </div>

        {/* Formas de Pagamento */}
        <div className="border-t border-blue-500 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-blue-200 text-sm font-medium">Formas de Pagamento:</span>
              <div className="flex items-center space-x-2">
                <img src="/payment-icons/visa.png" alt="Visa" className="h-6" />
                <img src="/payment-icons/mastercard.png" alt="Mastercard" className="h-6" />
                <img src="/payment-icons/elo.png" alt="Elo" className="h-6" />
                <img src="/payment-icons/pix.png" alt="PIX" className="h-6" />
                <img src="/payment-icons/boleto.png" alt="Boleto" className="h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-500 mt-8 pt-6 text-center">
          <p className="text-blue-200 text-sm">
            2025 © Vlar Tecnologia Ltda – Todos os direitos reservados. | CNPJ: 61.249.131/0001-00
          </p>
        </div>
      </div>
    </footer>
  )
}
