#!/bin/bash

# Colors
PURPLE='\033[34m'
PINK='\033[35m'
RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
BLUE='\033[36m'
GREY='\033[90m'
NC='\033[0m'

# special effects
REPLACE_LINE='\033[A\r\033[K'

# setup .env for development
cp .env_sample .env
echo -e $GREY"generate '$NC.env$GREY'"$NC
sleep 0.4

# check docker
if command -v docker > /dev/null 2>&1; then
  echo -e $REPLACE_LINE$GREEN"$NC'"$PINK"docker"$NC"'$GREEN is working"$NC
else
  echo -e >&2 $REPLACE_LINE$RED"$NC'"$PINK"docker"$NC"'$RED is NOT installed on your machine"$NC;
  exit 1
fi
sleep 0.4

# check docker compose
SERVER_VERSION=$(docker version -f "{{.Server.Version}}")
SERVER_VERSION_MAJOR=$(echo "$SERVER_VERSION"| cut -d'.' -f 1)
SERVER_VERSION_MINOR=$(echo "$SERVER_VERSION"| cut -d'.' -f 2)
SERVER_VERSION_BUILD=$(echo "$SERVER_VERSION"| cut -d'.' -f 3)

if [ "${SERVER_VERSION_MAJOR}" -ge 19 ] && \
   [ "${SERVER_VERSION_MINOR}" -ge 0 ]  && \
   [ "${SERVER_VERSION_BUILD}" -ge 3 ]; then
    echo -e $REPLACE_LINE$GREEN"You have Compose V2"$NC
    sleep 0.4
    echo -e $REPLACE_LINE$GREEN"You can use $NC'"$PINK"docker compose$NC'$GREEN command"$NC
else
  if command -v docker-compose > /dev/null 2>&1; then
    echo -e $REPLACE_LINE$GREEN"$NC'"$PINK"docker-compose$NC'$GREEN is working"$NC
    sleep 0.4
    echo -e $REPLACE_LINE$GREEN"You can use $NC'"$PINK"docker-compose$NC'$GREEN command"$NC
  else
    echo -e >&2 $REPLACE_LINE$YELLOW"$NC'"$PINK"docker-compose$NC' is NOT installed on your machine\n"$NC
    sleep 0.4
    echo -e >&2 $REPLACE_LINE$BLUE"You can either install $NC'"$PINK"docker-compose$NC'$BLUE or update your $NC'"$PINK"docker$NC'$BLUE version to 20.10.13 or higher to use (v2) $NC'"$PINK"docker compose$NC'"$NC
    exit 1
  fi
fi