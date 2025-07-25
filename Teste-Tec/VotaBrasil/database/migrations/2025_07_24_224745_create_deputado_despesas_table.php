<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('deputado_despesas', function (Blueprint $table) {
           $table->id();
            $table->unsignedBigInteger('deputado_id');
            $table->string('tipo');
            $table->date('data');
            $table->decimal('valor', 10, 2);
            $table->string('fornecedor')->nullable();
            $table->string('cnpj_cpf', 20)->nullable();
            $table->text('descricao')->nullable();
            $table->integer('ano');
            $table->integer('mes');
            $table->string('url_documento')->nullable();
            $table->string('cod_documento')->nullable();
            $table->string('cod_lote')->nullable();
            $table->unique(['cod_documento', 'deputado_id']);
            $table->timestamps();
            $table->unsignedBigInteger('id_legislatura');

     $table->foreign('deputado_id')->references('id')->on('deputados');
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
