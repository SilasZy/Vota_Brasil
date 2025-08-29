FROM php:8.2-apache

# Instalar extensões necessárias
RUN apt-get update && apt-get install -y \
    libzip-dev unzip curl git zip \
    && docker-php-ext-install pdo pdo_mysql zip

# Ativar mod_rewrite no Apache
RUN a2enmod rewrite

# Configurar Apache
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf
RUN echo "DirectoryIndex index.php index.html" >> /etc/apache2/apache2.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar APENAS o backend (VotaBrasil)
COPY Teste-Tec/VotaBrasil/ .

# 🔽🔽🔽 PRIMEIRO CRIAR .env 🔽🔽🔽
RUN cp .env.example .env

# Instalar dependências
RUN composer install --no-dev --optimize-autoloader

# 🔽🔽🔽 AGORA SIM GERAR A KEY 🔽🔽🔽
RUN php artisan key:generate
RUN php artisan config:clear
RUN php artisan cache:clear

# Configurar permissões
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache

EXPOSE 80