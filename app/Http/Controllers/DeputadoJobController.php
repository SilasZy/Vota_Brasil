<?php

namespace App\Http\Controllers;

use App\Jobs\Deputados;
use Illuminate\Http\JsonResponse;
 use App\Models\Deputado;

class DeputadoJobController extends Controller
{
    /**
     * Inicia o processamento da fila de deputados
     *
     * @return JsonResponse
     */
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
    public function listarDeputados() {
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



    public function createDeputado(Request $request) {
        $deputado = Deputado::create($request->all());
        return response()->json($deputado);
    }

    public function updateDeputado(Request $request, $id) {
        $deputado = Deputado::findOrFail($id);
        $deputado->update($request->all());
        return response()->json($deputado);
    }


    public function detalhes ($id) {
       $deputado = Deputado::find($id);

if(!$deputado) {
            return response()->json([
                'success' => false,
                'message' => 'Nenhum Deputado com o id encontrado',
            ], 404);
        }

        return response()->json($deputado);
    }
}
