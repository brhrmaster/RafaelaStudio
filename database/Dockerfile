FROM mysql:latest

RUN chown -R mysql:root /var/lib/mysql/

ENV MYSQL_DATABASE=RAFAELA_STUDIO_DB
ENV MYSQL_USER=rafaela_studio
ENV MYSQL_PASSWORD=123456
ENV MYSQL_ROOT_PASSWORD=root@123456

ADD create-database.sql /etc/mysql/create-database.sql

RUN sed -i 's/MYSQL_DATABASE/'$MYSQL_DATABASE'/g' /etc/mysql/create-database.sql
RUN cp /etc/mysql/create-database.sql /docker-entrypoint-initdb.d

EXPOSE 3306