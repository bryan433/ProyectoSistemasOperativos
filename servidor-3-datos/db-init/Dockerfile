FROM postgres:15-alpine

COPY scripts /scripts
COPY init.sh /init.sh

RUN chmod +x /init.sh && sed -i 's/\r$//' /init.sh

ENTRYPOINT ["/init.sh"]
