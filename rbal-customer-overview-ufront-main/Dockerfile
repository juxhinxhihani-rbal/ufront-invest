FROM docker.artifacts.rbi.tech/nginx:mainline

RUN addgroup --system appgroup
RUN adduser --system --ingroup appgroup --uid 1000 appuser

RUN mkdir -p /var/www/public /var/www/customer-overview-ufront /var/cache/nginx
RUN chown -R appuser:appgroup /var/www/public /var/www/customer-overview-ufront /var/cache/nginx
RUN chown appuser:appgroup /run
USER appuser

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist /var/www/customer-overview-ufront

USER appuser

EXPOSE 8080
