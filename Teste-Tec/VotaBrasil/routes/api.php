<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DeputadoJobController;
use App\Http\Controllers\DespesasController;
use App\Jobs\DespesasJob;
use Illuminate\Http\Request;

Route::post('/deputados/sincronizar/', [DeputadoJobController::class, 'iniciarFila']);
Route::post('/despesas/processar', [DespesasController::class, 'processar']);



Route::get('/deputados/count', [DeputadoJobController::class, 'countDeputados']);
Route::get('/deputados/pesquisar', [DeputadoJobController::class, 'pesquisar']);






Route::apiResource('deputados', DeputadoJobController::class);



Route::get('/teste', function () {
    return "Teste";
});
