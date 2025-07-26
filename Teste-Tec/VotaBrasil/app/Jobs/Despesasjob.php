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
        Log::info("Iniciando job para deputado_id: {$this->deputadoId}");

        $deputado = Deputado::find($this->deputadoId);
        if (!$deputado) {
            Log::error("Deputado não encontrado: {$this->deputadoId}");
            return;
        }

        try {
            $url = "https://dadosabertos.camara.leg.br/api/v2/deputados/{$deputado->id}/despesas";
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
        $deputadoId = $deputado->id;
        Log::info("Processando despesas para deputado {$deputadoId}, total: " . count($despesas));
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
                    $this->inserirLote($lote, $deputadoId);
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
            $this->inserirLote($lote, $deputadoId);
            $count += count($lote);
        }

        Log::info("Processadas {$count} despesas para deputado {$deputado->id}");
    }

    protected function inserirLote(array $lote, int $deputadoId): void
    {
        try {
            // Log para debug - verifique se o deputado_id está correto antes do upsert
            Log::debug('Dados antes do upsert', [
                'deputado_id_no_primeiro_item' => $lote[0]['deputado_id'] ?? null,
                'total_itens' => count($lote),
                'deputado_id_parametro' => $deputadoId
            ]);

            // Verificação adicional de consistência
            foreach ($lote as $item) {
                if ($item['deputado_id'] != $deputadoId) {
                    Log::warning('Inconsistência encontrada no lote', [
                        'esperado' => $deputadoId,
                        'encontrado' => $item['deputado_id'],
                        'cod_documento' => $item['cod_documento']
                    ]);
                }
            }

            // Upsert com tratamento especial para evitar conflitos
            Despesas::upsert(
                $lote,
                ['cod_documento', 'deputado_id'], // Chave única composta
                [
                    'tipo', 'data', 'valor', 'fornecedor', 'cnpj_cpf',
                    'descricao', 'ano', 'mes', 'url_documento',
                    'cod_lote', 'id_legislatura', 'updated_at'
                ]
            );

            // Log de confirmação pós-inserção
            $sampleDoc = $lote[0]['cod_documento'] ?? null;
            $inserted = Despesas::where('cod_documento', $sampleDoc)
                              ->where('deputado_id', $deputadoId)
                              ->first();

            Log::debug('Resultado pós-upsert', [
                'deputado_id_inserido' => $inserted->deputado_id ?? null,
                'cod_documento' => $inserted->cod_documento ?? null
            ]);

        } catch (\Exception $e) {
            Log::error("Erro inserindo lote para deputado {$deputadoId}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Função para salvar apenas o deputado_id (simulando um POST)
     *
     * @param int $deputadoId O ID do deputado a ser salvo
     * @return array Retorna um array com o status e mensagem
     */
    public function salvarDeputadoId($deputadoId)
    {
        try {
            // Aqui você pode adicionar lógica adicional se necessário
            // Por exemplo, verificar se o deputado existe
            $deputado = Deputado::find($deputadoId);

            if (!$deputado) {
                return [
                    'success' => false,
                    'message' => 'Deputado não encontrado',
                    'deputado_id' => $deputadoId
                ];
            }

            // Simulando o salvamento do ID
            // Na prática, você pode querer registrar isso em um log ou tabela específica
            Log::info("Deputado ID salvo com sucesso", ['deputado_id' => $deputadoId]);

            return [
                'success' => true,
                'message' => 'Deputado ID salvo com sucesso',
                'deputado_id' => $deputadoId
            ];

        } catch (\Exception $e) {
            Log::error("Erro ao salvar deputado_id", [
                'deputado_id' => $deputadoId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao salvar deputado_id',
                'error' => $e->getMessage(),
                'deputado_id' => $deputadoId
            ];
        }
    }

    public function retryUntil()
    {
        return now()->addMinutes(10);
    }

    public function failed(\Throwable $exception)
    {
        Log::critical("Job de despesas falhou para deputado {$this->deputadoId}", [
            'error' => $exception->getMessage()
        ]);
    }
}
