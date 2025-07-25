<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Jobs\DespesasJob; // Note o uso correto do nome da classe

class DespesasController extends Controller
{
    public function iniciarDespesas(): JsonResponse
    {
           try {
        DespesasJob::dispatch();

        return response()->json([
            'success' => true,
            'message' => 'Fila de atualização de despesas iniciada com sucesso'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erro ao iniciar a importação',
            'error' => $e->getMessage()
        ], 500);
    }
}
    }

