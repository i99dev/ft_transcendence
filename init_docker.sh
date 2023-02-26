#!/bin/zsh
# set env variables
# ask user for input to set variables
echo "Enter the CLIENT_ID"
read CLIENT_ID
echo "Enter the CLIENT_SECRET"
read CLIENT_SECRET
echo "Enter the REDIRECT_URI"
read REDIRECT_URI

# set env variables
export CLIENT_ID=$CLIENT_ID
echo $CLIENT_ID
export CLIENT_SECRET=$CLIENT_SECRET
echo $CLIENT_SECRET
export REDIRECT_URI=$REDIRECT_URI
echo $REDIRECT_URI

# 

