<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeputadoRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Altere para sua lógica de autorização se necessário
    }

    public function rules()
    {
        return [
            'nome' => 'required|string|max:255',
            'partido' => 'required|string|max:50',
            'uf' => 'required|string|size:2',
            'email' => 'nullable|email|max:255',
          

        ];
    }

    public function messages()
    {
        return [
            'nome.required' => 'O nome do deputado é obrigatório',
            'partido.required' => 'O partido é obrigatório',
            'uf.required' => 'O estado (UF) é obrigatório',
            'uf.size' => 'O UF deve ter exatamente 2 caracteres',
            'situacao.in' => 'Situação inválida (valores aceitos: ativo, licenca, afastado)',

        ];
    }
}
