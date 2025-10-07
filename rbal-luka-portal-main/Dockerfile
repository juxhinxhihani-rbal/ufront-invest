FROM docker.artifacts.rbi.tech/nginx:stable

RUN addgroup --system appgroup
RUN adduser --system --ingroup appgroup --uid 1000 appuser

RUN mkdir -p /var/www/public /var/www/rbal-luka-portal /var/cache/nginx
RUN chown -R appuser:appgroup /var/www/public /var/www/rbal-luka-portal /var/cache/nginx
RUN chown appuser:appgroup /run
USER appuser

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist /var/www/rbal-luka-portal
COPY ./reporting-server-cert/reporting-server-certificate.crt /usr/local/share/ca-certificates/reporting-server-certificate.crt

USER root
RUN update-ca-certificates

USER appuser
EXPOSE 8080


# FROM docker.artifacts.rbi.tech/nginx:stable

# RUN mkdir -p /var/www/public
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY ./dist /var/www/rbal-luka-portal

# COPY ./reporting-server-cert/reporting-server-certificate.crt /usr/local/share/ca-certificates/reporting-server-certificate.crt
# RUN update-ca-certificates

# EXPOSE 80
