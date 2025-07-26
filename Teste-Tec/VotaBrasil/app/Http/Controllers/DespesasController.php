<?php


namespace App\Http\Controllers;
use App\Jobs\DespesasJob;
use App\Models\Despesas;
use App\Models\Deputado;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DespesasController extends Controller
{
   public function processar(Request $request)
{
    $request->validate([
        'deputado_id' => 'required|integer|exists:deputados,id',
    ]);

    DespesasJob::dispatch($request->input('deputado_id'));

    return response()->json([
        'success' => true,
        'message' => 'Job de despesas disparado com sucesso.'
    ]);
}


    // Rota GET para listar despesas de um deputado
  public function show($id): JsonResponse
{
    $despesa = Despesas::find($id);

    if (!$despesa) {
        return response()->json([
            'success' => false,
            'message' => 'Nenhuma despesa com o ID informado foi encontrada.',
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $despesa
    ]);
}

}
