FROM postgres:15

COPY entrypoint-replica.sh /entrypoint-replica.sh
RUN chmod +x /entrypoint-replica.sh

ENTRYPOINT ["/entrypoint-replica.sh"]
