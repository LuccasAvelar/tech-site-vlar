"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img src="/vlar-icon.png" alt="Vlar" className="w-8 h-8 mr-2" />
              <h3 className="text-2xl font-bold">Vlar</h3>
            </div>
            <p className="text-black/80 mb-4">
              Os melhores vaporizadores, líquidos e produtos de tecnologia. Qualidade garantida e entrega rápida para
              todo o Brasil.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-black/80 hover:text-black transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-black/80 hover:text-black transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-black/80 hover:text-black transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/categoria/vaporizadores" className="text-black/80 hover:text-black transition-colors">
                  Vaporizadores
                </Link>
              </li>
              <li>
                <Link href="/categoria/liquidos" className="text-black/80 hover:text-black transition-colors">
                  Líquidos
                </Link>
              </li>
              <li>
                <Link href="/categoria/reposicao" className="text-black/80 hover:text-black transition-colors">
                  Reposição
                </Link>
              </li>
              <li>
                <Link href="/categoria/informatica" className="text-black/80 hover:text-black transition-colors">
                  Informática
                </Link>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="font-semibold mb-4">Atendimento</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contato" className="text-black/80 hover:text-black transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/meus-pedidos" className="text-black/80 hover:text-black transition-colors">
                  Meus Pedidos
                </Link>
              </li>
              <li>
                <Link href="/perfil" className="text-black/80 hover:text-black transition-colors">
                  Meu Perfil
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/5533998343132"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black/80 hover:text-black transition-colors flex items-center"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Informações da Empresa */}
        <div className="border-t border-black/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-black/80 text-sm">
                2024 © Vlar Tecnologia Ltda – Todos os direitos reservados. | CNPJ: 61.249.131/0001-00
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-black/80">
              <span>🚚 Frete grátis acima de R$ 299</span>
              <span>🔒 Compra 100% segura</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
