<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DeputadoJobController;
Route::get('/', function () {
    return view('welcome');
});

//routes deputados

Route::get('/deputados/count', [DeputadoJobController::class, 'countDeputados']);
Route::get('/deputados/pesquisar', [DeputadoJobController::class, 'pesquisar']);
Route::get('/deputados/sincronizar', [DeputadoJobController::class, 'iniciarFila']);
Route::apiResource('deputados', DeputadoJobController::class);

