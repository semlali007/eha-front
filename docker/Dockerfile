FROM

USER root

ENV ZAMMAD_VERSION=6.3.0 \
    IMLIB2_VERSION=1.4.9-8.el8.x86_64 \
	ZAMMAD_CLASSIFIER=1713510474.7663724c.centos8.x86_64 \
	RAILS_ENV=production \
	RAILS_SERVE_STATIC_FILES=true \
	GEMS_MIRROR=https://si-devops-mirror.edf.fr/repository/rubygems.org/ \
	NPM_MIRROR=https://si-devops-mirror.edf.fr/repository/registry.npmjs.org/

RUN mv /cockpitachat /opt/zammad

WORKDIR /opt/zammad

COPY . /opt/zammad
COPY ./deployment/database.yml /opt/zammad/config/ 	
ADD ./deployment/start_*.sh /

RUN chmod +x /start_*.sh && \
	$DNF_CMD groupinstall -y 'Development Tools' && \
    curl -fSL -u "$NEXUS_USERNAME:$NEXUS_PASSWORD" https://si-devops-repository.edf.fr/repository/eha-web-achat-raw/imlib2/imlib2-${IMLIB2_VERSION}.rpm -o /usr/src/imlib2-${IMLIB2_VERSION}.rpm && \
	rpm -U --nodeps /usr/src/imlib2-${IMLIB2_VERSION}.rpm && \
    curl -fSL -u "$NEXUS_USERNAME:$NEXUS_PASSWORD" https://si-devops-repository.edf.fr/repository/eha-web-achat-raw/imlib2/imlib2-devel-${IMLIB2_VERSION}.rpm -o /usr/src/imlib2-devel-${IMLIB2_VERSION}.rpm && \		
	rpm -U --nodeps /usr/src/imlib2-devel-${IMLIB2_VERSION}.rpm && \
    curl -fSL -u "$NEXUS_USERNAME:$NEXUS_PASSWORD" https://si-devops-repository.edf.fr/repository/eha-web-achat-raw/org/zammad/zammad-${ZAMMAD_VERSION}-${ZAMMAD_CLASSIFIER}.rpm -o /usr/src/zammad-${ZAMMAD_VERSION}.rpm && \
	cd /opt/zammad && \
	useradd zammad -m -d /opt/zammad -s /bin/bash && \
	rpm -U --nodeps /usr/src/zammad-${ZAMMAD_VERSION}.rpm && \
	chown -R zammad:root /opt/zammad && \
	chmod -R ug+rwX /opt/zammad && \
	chgrp -R root /usr/local && \
	chmod -R ug+rwX /usr/local && \
	chgrp -R root /etc/zammad && \
	chmod -R ug+rwX /etc/zammad && \
	mv Gemfile Gemfile.orig && \
	gem install bundler -v '2.4.8' && \
	grep -v "git:" Gemfile.orig > Gemfile && \
	echo "gem 'omniauth-weibo-oauth2'" >> Gemfile && \
	RUBYOPT=-W0 bundle config mirror.https://rubygems.org ${GEMS_MIRROR} && \	
	bundle config set --local path '/opt/zammad' && \
	bundle config set --local without 'test mysql development' && \	
	bundle update omniauth-weibo-oauth2 && \
	bundle install --retry=0 && \
	npm set registry $NPM_MIRROR && \
    chmod g=u /etc/passwd && \
    mkdir /home/default && \
    chmod ug+rwX /home/default && \
    chgrp -R 0 /home/default	

EXPOSE 3000

CMD ["/bin/bash", "/start_all.sh"]
