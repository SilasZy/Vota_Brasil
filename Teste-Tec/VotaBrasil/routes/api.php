<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DeputadoJobController;
use App\Http\Controllers\DespesasController;
// Customizadas (devem vir primeiro!)

Route::post('/deputados/sincronizar', [DeputadoJobController::class, 'iniciarFila']);
Route::post('/despesas/processar', [DespesasController::class, 'processar']);
Route::get('/deputados/count', [DeputadoJobController::class, 'countDeputados']);
Route::get('/deputados/pesquisar', [DeputadoJobController::class, 'pesquisar']);
Route::get('/deputados/partidos', [DeputadoJobController::class, 'getPartidos']);
Route::get('/deputados/ufs', [DeputadoJobController::class, 'getUfs']);

// apiResource sempre por último
Route::get('/teste', function () {
    return "Teste";
});
Route::apiResource('/deputados', DeputadoJobController::class);
Route::apiResource('/despesas', DespesasController::class);



