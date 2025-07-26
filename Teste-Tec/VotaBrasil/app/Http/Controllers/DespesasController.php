<?php

namespace App\Http\Controllers;

use App\Jobs\DespesasJob;
use Illuminate\Http\Request;
use App\Models\Despesas;

class DespesasController extends Controller
{
    public function processar(Request $request)
    {
      try {
        // Validação dos parâmetros opcionais
        $validated = $request->validate([
            'por_pagina' => 'sometimes|integer|min:1|max:100',
            'pagina' => 'sometimes|integer|min:1',
            'ano' => 'sometimes|integer|min:2000|max:' . date('Y'),
            'mes' => 'sometimes|integer|min:1|max:12',
            'tipo' => 'sometimes|string|max:50',
            'ordenar_por' => 'sometimes|in:valor,data,fornecedor',
            'ordem' => 'sometimes|in:asc,desc'
        ]);

        // Configuração da query
        $query = Despesas::with('deputado'); // Assumindo que há relação com o model Deputado

        // Filtros
        if ($request->has('ano')) {
            $query->where('ano', $request->ano);
        }

        if ($request->has('mes')) {
            $query->where('mes', $request->mes);
        }

        if ($request->has('tipo')) {
            $query->where('tipo', 'like', '%' . $request->tipo . '%');
        }

        // Ordenação
        $ordenarPor = $request->ordenar_por ?? 'data';
        $ordem = $request->ordem ?? 'desc';
        $query->orderBy($ordenarPor, $ordem);

        // Paginação
        $porPagina = $request->por_pagina ?? 15;
        $despesas = $query->paginate($porPagina);

        return response()->json([
            'success' => true,
            'meta' => [
                'total' => $despesas->total(),
                'por_pagina' => $despesas->perPage(),
                'pagina_atual' => $despesas->currentPage(),
                'ultima_pagina' => $despesas->lastPage()
            ],
            'data' => $despesas->items()
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erro ao listar despesas',
            'error' => $e->getMessage()
        ], 500);
    }
    }

    public function status(Request $request)
    {
        try {
            $request->validate([
                'deputado_id' => 'required|integer|exists:deputados,id'
            ]);

            $id = $request->input('deputado_id');
            $despesas = Despesas::where('deputado_id', $id)->get();

            if ($despesas->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nenhuma despesa encontrada para o deputado',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $despesas
            ])->setStatusCode(200, 'Despesas encontradas com sucesso');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar despesas',
                'error' => $e->getMessage() ?? 'Nenhuma despesa encontrada para o deputado'
            ], 500);
        }
    }

    public function salvar(Request $request)
    {
        try {
            $request->validate([
                'deputado_id' => 'required|integer|exists:deputados,id'
            ]);

            $deputadoId = $request->input('deputado_id');
            $response = $this->salvarDeputadoId($deputadoId);

            return response()->json([
                'success' => $response['success'],
                'message' => $response['message'],
                'deputado_id' => $response['deputado_id']
            ]);


        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao processar requisição',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $request->validate([
                'deputado_id' => 'required|integer|exists:deputados,id'
            ]);

            $deputadoId = $request->input('deputado_id');
            $despesas = Despesas::where('deputado_id', $deputadoId)
                ->orderBy('data', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $despesas
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar despesas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
