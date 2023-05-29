
dev:
		docker-compose up --build

dev-down:
		docker-compose down -v

prod:
		docker-compose -f docker-compose.prod.yml up --build

prod-down:
		docker-compose -f docker-compose.prod.yml down -v