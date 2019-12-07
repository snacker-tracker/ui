FROM nginx

COPY nginx/default.conf /etc/nginx/conf.d/

ADD ./build/ /usr/share/nginx/html
#RUN rm -rf /usr/share/nginx/html/config || true
