# Business Captain Backend

Backend for BusinessCaptain lite version, developed with Django 5.0.3.

### Dependencies:

```
Django==5.0.3
django-rest-framework==3.14.0
djoser==2.2.2
fpdf2==2.7.8
gunicorn==21.2.0
mysqlclient==2.2.0
numpy==1.26.4
pandas==2.2.1
```
For more information please review requirements.txt

### Configuration:

```
BASE_URL=http://localhost
SECRET_KEY=django-insecure-h^3t^femc08)l806e&_dqgzj!xl&e)&sfxrcgbw$g2i8inw4a5
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
ALLOWED_CORS_ORIGINS=http://localhost
CSRF_TRUSTED_ORIGINS=http://localhost
STATIC_REACT=/react/static
TEMPLATES_REACT=/react/templates
```

This project is configured to serve static React dist files. To do so, is expected to build the frontend and put the path to the resulting files in the STATIC_REACT variable. The entry file (usually index.html) is expected to be renamed to index_react.html and set the path to that file in TEMPLATES_REACT

The project includes a Dockerfile which is configured to do the process of building frontend and install backend dependencies. Also check the dockercompose.yml in the root of the project

### Initial Data

To run migrations:

`python manage.py migrate`

To generate superuser run:

`python manage.py createsuperuser`

To generate initial data run:

`python manage.py create_initial_data`

