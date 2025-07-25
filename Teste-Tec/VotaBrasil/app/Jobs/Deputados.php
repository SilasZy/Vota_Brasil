<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Models\Deputado;

class Deputados implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  public function __construct(
    protected ?string $legislaturaAtual = null,
    protected bool $forcarAtualizacao = false
) {
    if ($legislaturaAtual && !ctype_digit($legislaturaAtual)) {
        throw new InvalidArgumentException('ID de legislatura deve conter apenas números');
    }
}

   public function handle(): void
    {
        $url = $this->legislaturaAtual
            ? "https://dadosabertos.camara.leg.br/api/v2/deputados?idLegislatura={$this->legislaturaAtual}"
            : 'https://dadosabertos.camara.leg.br/api/v2/deputados';

        $response = Http::retry(2, 1000)
            ->timeout(30)
            ->get($url);

        if ($response->successful()) {
            $deputados = $response->json()['dados'];

            foreach ($deputados as $deputado) {
                Deputado::updateOrCreate(
                    ['id_api' => $deputado['id']],
                    [
                        'nome' => $deputado['nome'],
                        'siglaPartido' => $deputado['siglaPartido'],
                        'siglaUf' => $deputado['siglaUf'],
                        'url' => $deputado['uri'],
                        'urlFoto' => $deputado['urlFoto'],
                        'uriPartido' => $deputado['uriPartido'],
                        'email' => $deputado['email'] ?? null,
                        'id_legislatura' => $this->legislaturaAtual ?? null
                    ]
                );
            }
        }
    }
}


