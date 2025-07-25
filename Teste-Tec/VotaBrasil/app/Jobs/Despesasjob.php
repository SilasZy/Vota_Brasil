<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Deputado;
use App\Models\Despesas;

class DespesasJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected ?int $deputadoId;

    public function __construct(?int $deputadoId = null)
    {
        $this->deputadoId = $deputadoId;
    }

    public function handle()
    {
        $deputados = $this->deputadoId
            ? Deputado::where('id', $this->deputadoId)->get()
            : Deputado::all();

        if ($deputados->isEmpty()) {
            Log::warning('⚠ Nenhum deputado encontrado para importar despesas');
            return;
        }

        foreach ($deputados as $deputado) {
            $this->processarDeputado($deputado);
        }
    }

    private function processarDeputado(Deputado $deputado)
    {
        $pagina = 1;
        $totalInseridas = 0;
        $totalAtualizadas = 0;

        do {
            $response = Http::retry(3, 1000)->timeout(30)
                ->get("https://dadosabertos.camara.leg.br/api/v2/deputados/{$deputado->id_api}/despesas", [
                    'pagina' => $pagina,
                    'itens' => 100
                ]);

            if (!$response->successful()) {
                Log::error(" Falha ao buscar despesas do deputado {$deputado->id_api}");
                break;
            }

            $dados = $response->json();
            $despesas = $dados['dados'] ?? [];
            $ultimaPagina = $this->obterUltimaPagina($dados);

            foreach ($despesas as $despesa) {
                $resultado = $this->salvarDespesa($deputado, $despesa);
                if ($resultado === 'inserida') $totalInseridas++;
                if ($resultado === 'atualizada') $totalAtualizadas++;
            }

            $pagina++;
        } while ($pagina <= $ultimaPagina);

        Log::info(" Importação finalizada para deputado {$deputado->id_api} | Inseridas: {$totalInseridas} | Atualizadas: {$totalAtualizadas}");
    }

    private function obterUltimaPagina(array $dados): int
    {
        if (!isset($dados['links'])) return 1;

        foreach ($dados['links'] as $link) {
            if ($link['rel'] === 'last') {
                return (int)($link['pagina'] ?? 1);
            }
        }
        return 1;
    }

  protected function salvarDespesa(array $dadosDespesa)
{
    try {
        // 🔹 Busca o deputado local pelo id_api
        $deputadoLocal = Deputado::where('id_api', $dadosDespesa['idDeputado'])->first();

        if (!$deputadoLocal) {
            Log::warning("Deputado não encontrado para id_api {$dadosDespesa['idDeputado']}");
            return;
        }

        Despesas::updateOrCreate(
            [
                'cod_documento' => $dadosDespesa['codDocumento'],
                'deputado_id'   => $deputadoLocal->id,
            ],
            [
                'tipo'          => $dadosDespesa['tipoDespesa'] ?? null,
                'data'          => $dadosDespesa['dataDocumento'] ?? null,
                'valor'         => $dadosDespesa['valorDocumento'] ?? 0,
                'fornecedor'    => $dadosDespesa['nomeFornecedor'] ?? null,
                'cnpj_cpf'      => $dadosDespesa['cnpjCpfFornecedor'] ?? null,
                'descricao'     => $dadosDespesa['descricao'] ?? null,
                'ano'           => $dadosDespesa['ano'] ?? null,
                'mes'           => $dadosDespesa['mes'] ?? null,
                'url_documento' => $dadosDespesa['urlDocumento'] ?? null,
                'cod_lote'      => $dadosDespesa['codLote'] ?? null,
                'id_legislatura'=> $dadosDespesa['idLegislatura'] ?? null,
            ]
        );
    } catch (\Exception $e) {
        Log::error("Erro ao salvar despesa {$dadosDespesa['codDocumento']}: " . $e->getMessage());
    }
}

}
