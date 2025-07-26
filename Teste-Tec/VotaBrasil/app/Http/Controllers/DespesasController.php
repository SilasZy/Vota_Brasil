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
            'deputado_id' => 'required|integer|exists:deputados,id'
        ]);

        DespesasJob::dispatch($request->deputado_id);

        return response()->json([
            'success' => true,
            'message' => 'Job de importação de despesas disparado para o deputado '.$request->deputado_id,
            'data' => [
                'deputado_id' => $request->deputado_id,
                'job' => DespesasJob::class
            ]
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

public function index(): JsonResponse
{
    $despesas = Despesas::all();

    if ($despesas->isEmpty()) {
        return response()->json([
            'success' => false,
            'message' => 'Nenhuma despesa encontrada.',
        ], 404);
    }
    return response()->json([
        'success' => true,
        'data' => $despesas
    ]);


}
public function porDeputado($id)
{
    $despesas = Despesas::where('deputado_id', $id)->get();

    return response()->json([
        'success' => true,
        'data' => $despesas,
    ]);
}


}
