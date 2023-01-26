import { PrismaService } from './../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { Injectable } from "@nestjs/common";

@Injectable({})
export class userService{
	constructor(private prisma: PrismaService) {}

	getSignin() {
		return this.prisma.user.findFirst();
	  }

	  getSignup(): string {
		return 'Hello from signup!';
	  }
}