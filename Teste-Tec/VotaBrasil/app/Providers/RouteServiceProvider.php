<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Define your route model bindings, pattern filters, etc.
     */
    public function boot(): void
    {
        $this->routes(function () {
            // Rotas da API
            Route::prefix('api')
                ->middleware('api')
                ->group(base_path('routes/api.php'));

            // Rotas da web espero q pegue
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }
}
