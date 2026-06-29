FROM postgres:15-alpine

COPY scripts /scripts
COPY init.sh /init.sh

RUN chmod +x /init.sh

ENTRYPOINT ["/init.sh"]
