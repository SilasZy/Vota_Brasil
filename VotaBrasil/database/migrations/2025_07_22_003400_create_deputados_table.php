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
        Schema::create('deputados', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_api')->unique();
            $table->string('nome');
            $table->string('siglaPartido')->nullable();
            $table->string('siglaUf')->nullable();
            $table->string('email')->nullable();
            $table->string('url')->nullable();
            $table->string('urlFoto')->nullable();
            $table->string('uriPartido')->nullable();
           $table->unsignedInteger('id_legislatura')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deputados');
    }
};
