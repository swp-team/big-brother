#!/bin/bash

set -e

echo "Making database migrations..."
./manage.py makemigrations
echo "done"
echo

echo "Applying database migrations..."
./manage.py migrate
echo "done"
echo

if [ "$1" = 'uwsgi' ]; then
  [[ -S /tmp/sockets/wsgi.sock ]] && rm /tmp/sockets/wsgi.sock
  exec $@ \
      --master \
      --processes=$UWSGI_PROCESSES \
      --threads=$UWSGI_THREADS \
      --harakiri=$UWSGI_HARAKIRI \
      --max-requests=$UWSGI_MAX_REQUESTS \
      --module=$DJANGO_APP_NAME.wsgi:application \
      --socket=/tmp/sockets/wsgi.sock \
      --chmod-socket=666
fi

exec "$@"
