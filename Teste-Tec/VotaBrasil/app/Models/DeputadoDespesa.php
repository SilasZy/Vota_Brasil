<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeputadoDespesa extends Model
{
    //falta mandar para a base de dados  e colocar no docker
    
    use HasFactory;

    protected $table = 'deputado_despesas';

    protected $fillable = [
        'deputado_id',
        'ano',
        'mes',
        'cnpjCpfFornecedor',
        'codDocumento',
        'codLote',
        'codTipoDocumento',
        'dataDocumento',
        'nomeFornecedor',
        'numDocumento',
        'numRessarcimento',
        'parcela',
        'tipoDespesa',
        'tipoDocumento',
        'urlDocumento',
        'valorDocumento',
        'valorGlosa',
        'valorLiquido',
    ];

    public function deputado()
    {
        return $this->belongsTo(Deputado::class, 'deputado_id');
    }
}
