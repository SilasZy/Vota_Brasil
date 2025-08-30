FROM php:8.2-apache

# Instalar extensões necessárias
RUN apt-get update && apt-get install -y \
    libzip-dev unzip curl git zip \
    && docker-php-ext-install pdo pdo_mysql zip

# Ativar mod_rewrite no Apache
RUN a2enmod rewrite

# Configurar DocumentRoot para public
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Permitir uso do .htaccess do Laravel
RUN echo "<Directory /var/www/html/public>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>" > /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel

# Ajustes adicionais no Apache
RUN echo "DirectoryIndex index.php index.html" >> /etc/apache2/apache2.conf \
    && echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Definir diretório de trabalho
WORKDIR /var/www/html

# Copiar código Laravel
COPY Teste-Tec/VotaBrasil/ /var/www/html

# Instalar dependências do Laravel
RUN composer install --no-dev --optimize-autoloader

# Configurar permissões corretas
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache

# Expõe a porta 80 (Render detecta automaticamente)
EXPOSE 80

# Inicia o Apache no modo foreground (padrão do Render)
CMD ["apache2-foreground"]
