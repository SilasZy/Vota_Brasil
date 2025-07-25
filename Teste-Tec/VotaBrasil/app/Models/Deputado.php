<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Deputado extends Model
{
    protected $table = 'deputados';

    protected $fillable = [
        'id_api',
        'nome',
        'siglaPartido',
        'siglaUf',
        'url',
        'urlFoto',
        'uriPartido',
        'email',
        'id_legislatura',
    ];

    /**
     * Um deputado tem muitas despesas.
     */
    public function despesas(): HasMany
    {
        return $this->hasMany(DespesasDeputado::class, 'deputado_id', 'id');
    }
}
