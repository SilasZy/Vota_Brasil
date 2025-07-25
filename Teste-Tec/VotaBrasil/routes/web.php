<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DeputadoJobController;
use App\Http\Controllers\DespesasController;


//routes deputados

Route::get('/deputados/count', [DeputadoJobController::class, 'countDeputados']);
Route::get('/deputados/pesquisar', [DeputadoJobController::class, 'pesquisar']);
Route::get('/deputados/sincronizar/', [DeputadoJobController::class, 'iniciarFila']);
Route::get('/despesas/iniciar', [DespesasController::class, 'iniciarDespesas']);

// Nova rota para disparar processamento das despesas (job)

Route::get('/testar-despesas', function() {

    \App\Jobs\DespesasJob::dispatch();



    return "Job de despesas disparado com sucesso! Verifique o log em storage/logs/laravel.log";
});

// Rota padrão REST para deputados
Route::apiResource('deputados', DeputadoJobController::class);

