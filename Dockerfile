FROM php:8.2-apache

# Instalar extensões necessárias
RUN apt-get update && apt-get install -y \
    libzip-dev unzip curl git zip \
    && docker-php-ext-install pdo pdo_mysql zip

# Ativar mod_rewrite no Apache
RUN a2enmod rewrite

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Criar diretório de trabalho
WORKDIR /var/www/html

# 🔽🔽🔽 MUDANÇA CRÍTICA AQUI 🔽🔽🔽
# Copiar APENAS o backend (VotaBrasil) - NÃO copia frontend
COPY Teste-Tec/VotaBrasil/ .

# Instalar dependências do Composer
RUN if [ -f "composer.json" ]; then \
    composer install --no-dev --optimize-autoloader; \
    fi

# Configurar permissões
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache

# Expor porta 80
EXPOSE 80
