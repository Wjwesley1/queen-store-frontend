import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [sabonetes, setSabonetes] = useState([
    // Dados mockados
    { id: 1, nome: 'Sabonete de Lavanda', preco: 15.90, imagem: 'https://via.placeholder.com/150' },
    { id: 2, nome: 'Sabonete de Camomila', preco: 14.50, imagem: 'https://via.placeholder.com/150' },
  ]);

  // Descomente quando o back-end estiver pronto
  /*
  useEffect(() => {
    axios.get('https://queen-store-api-xxx.a.run.app/api/sabonetes')
      .then(res => setSabonetes(res.data))
      .catch(err => console.error(err));
  }, []);
  */

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-purple-600">Queen Store</h1>
      <p className="text-center mt-2">Sabonetes artesanais feitos com amor</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {sabonetes.map(sabonete => (
          <div key={sabonete.id} className="border p-4 rounded-lg:shadow-lg">
            <img src={sabonete.imagem} alt={sabonete.nome} className="w-full h-48 object-cover rounded" />
            <h2 className="text-xl font-semibold mt-2">{sabonete.nome}</h2>
            <p className="text-gray-600">R$ {sabonete.preco.toFixed(2)}</p>
            <button className="bg-purple-500 text-white px-4 py-2 mt-4 rounded hover:bg-purple-600">
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;