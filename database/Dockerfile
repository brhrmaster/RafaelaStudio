FROM mysql:latest

RUN chown -R mysql:root /var/lib/mysql/

ENV MYSQL_DATABASE=RAFAELA_STUDIO_DB
ENV MYSQL_USER=rafaela_studio
ENV MYSQL_PASSWORD=Superstition!32@2
ENV MYSQL_ROOT_PASSWORD=root@gerenteMaster

#ADD create-database-v2.sql /etc/mysql/create-database-v2.sql

#RUN sed -i 's/MYSQL_DATABASE/'$MYSQL_DATABASE'/g' /etc/mysql/create-database-v2.sql
#RUN cp /etc/mysql/create-database-v2.sql /docker-entrypoint-initdb.d

EXPOSE 3306