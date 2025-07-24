<?php

namespace App\Http\Controllers;

use App\Jobs\Deputados;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Deputado;

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
        $deputado = Deputado::create($request->all());
        return response()->json([
            'success' => true,
            'data' => $deputado
        ]);
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
    $nome = $request->query('nome');

    if (empty($nome)) {
        return response()->json(['message' => 'O parâmetro "nome" é obrigatório'], 400);
    }

    $deputados = Deputado::where('nome', 'like', '%' . $nome . '%')->get();

    if ($deputados->isNotEmpty()) {
        return response()->json($deputados, 200);
    } else {
        return response()->json(['message' => 'Deputado não encontrado'], 404);
    }
}

}
