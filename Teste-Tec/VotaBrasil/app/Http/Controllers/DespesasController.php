<?php

namespace App\Http\Controllers;

use App\Jobs\DespesasJob;
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
}
