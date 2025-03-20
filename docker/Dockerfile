FROM

USER root

COPY ./src /opt/app-root/src/

RUN $DNF_CMD -y update --nobest

EXPOSE 443

RUN /usr/libexec/s2i/assemble

CMD /usr/libexec/s2i/run