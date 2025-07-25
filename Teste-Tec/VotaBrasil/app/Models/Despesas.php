<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Despesas extends Model
{
    protected $table = 'deputado_despesas';

    protected $fillable = [
        'deputado_id',
        'tipo',
        'data',
        'valor',
        'fornecedor',
        'cnpj_cpf',
        'descricao',
        'ano',
        'mes',
        'url_documento',
        'cod_documento',
        'cod_lote',
        'id_legislatura'
    ];

    public function deputado(): BelongsTo
    {
        return $this->belongsTo(Deputado::class, 'deputado_id', 'id');
    }
}
