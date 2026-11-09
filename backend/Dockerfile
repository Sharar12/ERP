# ── Stage 1: composer dependencies ─────────────────────────
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev --no-interaction --no-scripts --prefer-dist --optimize-autoloader

# ── Stage 2: PHP runtime ──────────────────────────────────
FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    icu-dev oniguruma-dev libzip-dev zip unzip git \
    && docker-php-ext-install pdo_mysql intl opcache zip bcmath

# OpCache tuning — production
RUN echo "opcache.enable=1"                       >  /usr/local/etc/php/conf.d/opcache.ini \
 && echo "opcache.memory_consumption=256"         >> /usr/local/etc/php/conf.d/opcache.ini \
 && echo "opcache.validate_timestamps=0"          >> /usr/local/etc/php/conf.d/opcache.ini \
 && echo "opcache.max_accelerated_files=20000"    >> /usr/local/etc/php/conf.d/opcache.ini \
 && echo "opcache.jit_buffer_size=100M"           >> /usr/local/etc/php/conf.d/opcache.ini

WORKDIR /var/www/backend
COPY --from=vendor /app/vendor ./vendor
COPY . .

RUN cp .env.example .env \
 && php artisan key:generate --force \
 && chown -R www-data:www-data storage bootstrap/cache

USER www-data
EXPOSE 9000
CMD ["php-fpm"]

