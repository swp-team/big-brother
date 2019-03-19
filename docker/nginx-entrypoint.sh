#!/bin/bash

set -e 

if [ "$1" = "nginx" ]; then
    if [ -z "$NGINX_CONFIG" ]; then
        exec $@ -g 'daemon off;'
    else
        exec $@ -g 'daemon off;' -c "/etc/nginx/$NGINX_CONFIG"
    fi
fi
