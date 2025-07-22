'use client'

import { useEffect, useState } from 'react'


type Deputado ={
  id: number
  nome: string
  siglaPartido: string
  siglaUf: string
  urlFoto: string
}

export default function Deputados() {
  const [deputados, setDeputados] = useState([] as Deputado[])

  useEffect(() => {
  fetch('http://localhost:8080/deputados/listar')
      .then((res) => res.json())
      .then((data) => {
        setDeputados(data.data?.data || [])
      })
      .catch(() => alert('Erro ao buscar deputados'))
  }, [])

  return (
    <div>
      <h1>Lista de Deputados</h1>
      {deputados.map((dep) => (
        <div key={dep.id} style={{ marginBottom: 12 }}>
          <img src={dep.urlFoto} alt={dep.nome} width={80} />
          <p>{dep.nome} ({dep.siglaPartido} - {dep.siglaUf})</p>
        </div>
      ))}
    </div>
  )
}
