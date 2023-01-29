import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
	constructor(private prisma: PrismaService) {}

	// GetToken(name: any): string{
	// 	let token: string = name.split(' ')[1];
	// 	return token;
	// }

}