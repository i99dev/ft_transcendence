#!/bin/bash
echo "Are you sure docker is running? (y/n)"
read answer
if [ "$answer" = "y" ]; then
    echo "Starting docker containers..."
    # build postgresql container
    docker run --name ft_transcendence-api-1 -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -e POSTGRES_DB=transcendence -p 5432:5432 -d postgres
    echo "Docker containers started."
    echo "Waiting for postgresql to start..."
    sleep 5
    npx prisma migrate dev --name init --preview-feature
else
    echo "Docker is not running. Exiting..."
    exit 1
fi