<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
        'descricao', // Corrigi o nome do campo (estava 'descriaco')
        'ano',
        'mes',
        'url_documento',
        'cod_documento',
        'cod_lote',
        'id_legislatura'
    ];

    /**
     * Uma despesa pertence a um deputado.
     */
    public function deputado(): BelongsTo
    {
        return $this->belongsTo(Deputado::class, 'deputado_id', 'id');
    }
}
