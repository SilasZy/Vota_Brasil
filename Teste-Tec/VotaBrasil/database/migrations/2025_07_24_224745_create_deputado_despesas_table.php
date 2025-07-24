<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('deputado_despesas', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('deputado_id'); // FK para deputados.id

            $table->year('ano');
            $table->unsignedBigInteger('mes');
            $table->string('cnpjCpfFornecedor');
            $table->unsignedBigInteger('codDocumento');
            $table->unsignedBigInteger('codLote');
            $table->unsignedBigInteger('codTipoDocumento');
            $table->date('dataDocumento');
            $table->string('nomeFornecedor');
            $table->string('numDocumento');
            $table->string('numRessarcimento')->nullable();
            $table->unsignedBigInteger('parcela')->nullable();
            $table->string('tipoDespesa');
            $table->string('tipoDocumento');
            $table->string('urlDocumento');
            $table->double('valorDocumento', 10, 2);
            $table->double('valorGlosa', 10, 2)->default(0);
            $table->double('valorLiquido', 10, 2);

            $table->timestamps();

            $table->foreign('deputado_id')->references('id')->on('deputados')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::dropIfExists('deputado_despesas');
    }
};
