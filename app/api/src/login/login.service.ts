import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from "@nestjs/common";

@Injectable({})
export class LoginService {
	constructor(private prisma: PrismaService) {}
}