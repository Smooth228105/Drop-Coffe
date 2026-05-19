python:
	python manage.py runserver

frontend:
	cd frontend

install:
	npm install

dev:
	npm run dev

admin:
	python manage.py set_user_role "user_name" admin

manager:
	python manage.py set_user_role "user_name" manager
	
migrate:
	python manage.py migrate