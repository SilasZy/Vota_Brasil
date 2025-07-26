<?php

namespace App\Jobs;

use App\Models\Deputado;
use App\Models\Despesas;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;

class DespesasJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $deputadoId;
    public $timeout = 300; // Aumenta o timeout para 5 minutos
    public $tries = 3; // Número de tentativas

    public function __construct($deputadoId)
    {
        $this->deputadoId = $deputadoId;
    }

    public function handle(): void
    {
        $deputado = Deputado::find($this->deputadoId);
        if (!$deputado) {
            Log::warning("Deputado não encontrado: {$this->deputadoId}");
            return;
        }

        try {

            $url = "https://dadosabertos.camara.leg.br/api/v2/deputados/{$deputado->id_api}/despesas";
            $url .= "?itens=100&ordem=ASC&ordenarPor=ano";

            $response = Http::timeout(60)
                ->retry(3, 1000)
                ->get($url);

            if (!$response->successful()) {
                Log::error("Falha na requisição para deputado {$deputado->id}", [
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
                return;
            }

            $dados = $response->json();
            $despesas = $dados['dados'] ?? [];

            if (empty($despesas)) {
                Log::info("Nenhuma despesa encontrada para deputado {$deputado->id}");
                return;
            }


            $this->processarEmLotes($deputado, $despesas);

        } catch (\Exception $e) {
            Log::error("Erro no job para deputado {$deputado->id}: " . $e->getMessage());
            throw $e;
        }
    }

    protected function processarEmLotes($deputado, $despesas)
    {
        $lote = [];
        $count = 0;

        foreach ($despesas as $item) {
            try {
                $lote[] = [
                    'cod_documento' => $item['codDocumento'] ?? null,
                    'deputado_id' => $deputado->id,
                    'tipo' => $item['tipoDespesa'] ?? 'OUTROS',
                    'data' => $item['dataDocumento'] ?? now()->format('Y-m-d'),
                    'valor' => (float)($item['valorDocumento'] ?? 0),
                    'fornecedor' => substr($item['nomeFornecedor'] ?? '', 0, 191),
                    'cnpj_cpf' => $item['cnpjCpfFornecedor'] ?? null,
                    'descricao' => substr($item['descricao'] ?? '', 0, 500),
                    'ano' => $item['ano'] ?? date('Y'),
                    'mes' => $item['mes'] ?? date('m'),
                    'url_documento' => $item['urlDocumento'] ?? null,
                    'cod_lote' => $item['codLote'] ?? null,
                    'id_legislatura' => $item['idLegislatura'] ?? 56,
                    'created_at' => now(),
                    'updated_at' => now()
                ];

                // Insere em lotes de 100 para melhor performance
                if (count($lote) >= 100) {
                    $this->inserirLote($lote);
                    $count += count($lote);
                    $lote = [];
                }
            } catch (\Exception $e) {
                Log::error("Erro processando despesa: " . $e->getMessage(), [
                    'item' => $item
                ]);
                continue;
            }
        }

        // Insere o restante
        if (!empty($lote)) {
            $this->inserirLote($lote);
            $count += count($lote);
        }

        Log::info("Processadas {$count} despesas para deputado {$deputado->id}");
    }

    protected function inserirLote(array $lote)
    {
        try {
            Despesas::upsert(
                $lote,
                ['cod_documento', 'deputado_id'], // Chave única
                [
                    'tipo', 'data', 'valor', 'fornecedor', 'cnpj_cpf',
                    'descricao', 'ano', 'mes', 'url_documento',
                    'cod_lote', 'id_legislatura', 'updated_at'
                ]
            );
        } catch (\Exception $e) {
            Log::error("Erro inserindo lote: " . $e->getMessage());
            throw $e;
        }
    }

    public function failed(\Throwable $exception)
    {
        Log::critical("Job de despesas falhou para deputado {$this->deputadoId}", [
            'error' => $exception->getMessage()
        ]);
    }
}
