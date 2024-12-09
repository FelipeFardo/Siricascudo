import Link from 'next/link'

export default async function Footer() {
  return (
    <footer className="py-8 text-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">Siricascudo</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:underline">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link
                  href="http://localhost:3333/docs"
                  className="hover:underline"
                >
                  Documentação API
                </Link>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Carreiras
                </a>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Para Restaurantes</h3>

            <ul className="space-y-2">
              <li>
                <Link href="/admin">Painel administrativo</Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Cadastre seu restaurante
                </Link>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Área do parceiro
                </a>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Entregador parceiro
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Para Clientes</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:underline">
                  Peça comida
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Busque restaurantes
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Central de ajuda
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-700">
                {/* <Facebook size={24} /> */}
              </a>
              <a href="#" className="hover:text-gray-700">
                {/* <Instagram size={24} /> */}
              </a>
              <a href="#" className="hover:text-gray-700">
                {/* <Twitter size={24} /> */}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Siricascudo. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
