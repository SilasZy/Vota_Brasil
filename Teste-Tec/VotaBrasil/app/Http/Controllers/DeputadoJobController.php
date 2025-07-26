<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\Deputados;
use App\Models\Deputado;
use Illuminate\Http\JsonResponse;

class DeputadoJobController extends Controller
{

public $countDeputados;

    public function iniciarFila(): JsonResponse
    {
        try {
            Deputados::dispatch();

            return response()->json([
                'success' => true,
                'message' => 'Fila de atualização de deputados iniciada com sucesso'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao iniciar a fila de deputados',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function index(): JsonResponse
    {
        try {
            $paginate = Deputado::paginate(10);

            if ($paginate->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nenhum deputado encontrado',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $paginate
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar deputados',
                'error' => $th->getMessage()
            ], 500);
        }
    }

 public function store(Request $request): JsonResponse
{
    $validated = $request->validate([
        'id_api' => 'required|integer|unique:deputados,id_api',
        'nome' => 'required|string',
        'siglaPartido' => 'nullable|string',
        'siglaUf' => 'nullable|string',
        'email' => 'nullable|email',
        'url' => 'nullable|url',
        'urlFoto' => 'nullable|url',
        'uriPartido' => 'nullable|url',
        'id_legislatura' => 'required|integer',
    ]);

    $deputado = Deputado::create($validated);

    return response()->json([
        'success' => true,
        'message' => 'Deputado cadastrado com sucesso.',
        'data' => $deputado
    ], 201);
}

    public function show($id): JsonResponse
    {
        $deputado = Deputado::find($id);

        if (!$deputado) {
            return response()->json([
                'success' => false,
                'message' => 'Nenhum deputado com o ID informado foi encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $deputado
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $deputado = Deputado::findOrFail($id);
        $deputado->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $deputado
        ]);
    }


    public function destroy($id): JsonResponse
    {
        $deputado = Deputado::find($id);

        if (!$deputado) {
            return response()->json([
                'success' => false,
                'message' => 'Deputado não encontrado',
            ], 404);
        }

        $deputado->delete();

        return response()->json([
            'success' => true,
            'message' => 'Deputado deletado com sucesso'
        ]);


    }
//procurar por partido
public function countDeputados(): JsonResponse
{


    $countDeputados = Deputado::count();


    return response()->json([
        'success' => true,
        'data' => $countDeputados
    ]);

}


 public function pesquisar(Request $request)
    {
        $request->validate([
            'nome' => 'nullable|string',
            'partido' => 'nullable|string',
            'uf' => 'nullable|string',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100'
        ]);

        $query = Deputado::query();

        // Filtro por nome
        if ($request->filled('nome')) {
            $query->where('nome', 'like', '%' . $request->nome . '%');
        }

        // Filtro por partido
        if ($request->filled('partido') && $request->partido !== 'all') {
            $query->where('siglaPartido', $request->partido);
        }

        // Filtro por UF
        if ($request->filled('uf') && $request->uf !== 'all') {
            $query->where('siglaUf', $request->uf);
        }

        // Paginação
        $perPage = $request->per_page ?? 10;
        $deputados = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Deputados encontrados',
            'data' => $deputados->items(),
            'meta' => [
                'current_page' => $deputados->currentPage(),
                'last_page' => $deputados->lastPage(),
                'per_page' => $deputados->perPage(),
                'total' => $deputados->total(),
            ]
        ]);
    }

    // Métodos para obter opções de filtro
  public function getPartidos(): JsonResponse
{
    try {
        $partidos = Deputado::distinct()
            ->orderBy('siglaPartido')
            ->pluck('siglaPartido')
            ->toArray();

        return response()->json([
            'success' => true,
            'data' => $partidos
        ]);
    } catch (\Throwable $th) {
        return response()->json([
            'success' => false,
            'message' => 'Erro ao listar partidos',
            'error' => $th->getMessage()
        ], 500);
    }
}

public function getUfs(): JsonResponse
{
    try {
        $ufs = Deputado::distinct()
            ->orderBy('siglaUf')
            ->pluck('siglaUf')
            ->toArray();

        return response()->json([
            'success' => true,
            'data' => $ufs
        ]);
    } catch (\Throwable $th) {
        return response()->json([
            'success' => false,
            'message' => 'Erro ao listar UFs',
            'error' => $th->getMessage()
        ], 500);
    }
}
}





