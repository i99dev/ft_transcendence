#!/bin/bash

# check device opration system and echo 
if [ -f /etc/redhat-release ]; then
    echo "RedHat"
elif [ -f /etc/debian_version ]; then
    echo "Debian"
else
    echo "Unknown"
fi
