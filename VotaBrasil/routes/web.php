<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DeputadoJobController;
Route::get('/', function () {
    return view('welcome');
});


Route::get('/deputados/atualizar', [DeputadoJobController::class, 'iniciarFila']);
Route::get('/deputados/listar', [DeputadoJobController::class, 'listarDeputados']);
Route::post('/deputados/create', [DeputadoJobController::class, 'createDeputado']);
Route::put('/deputados/update/{id}', [DeputadoJobController::class, 'updateDeputado']);
Route::get('/deputados/detalhes/{id}', [DeputadoJobController::class, 'detalhes']);
