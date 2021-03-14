FROM postgres

EXPOSE 5432
ENV POSTGRES_DB=atm
ENV POSTGRES_PASSWORD=password
COPY debug-postgres.conf /etc/postgresql/postgresql.conf

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
