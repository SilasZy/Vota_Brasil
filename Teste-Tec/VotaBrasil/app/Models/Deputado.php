<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Deputado extends Model
{
    protected $table = 'deputados';



    protected $fillable = [
        'id_api',
        'nome',
        'siglaPartido',
        'siglaUf',
        'email',
        'url',
        'urlFoto',
        'uriPartido',
        'id_legislatura'
    ];
}
return $this->hasMany(DeputadoDespesa::class, 'deputado_id');
