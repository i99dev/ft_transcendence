#!/bin/bash

yes $'\n' | npx prisma migrate deploy
yes $'\n' | npx prisma migrate dev