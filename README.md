# Business Captain

A easy-to-use POS for retail stores.

### Description

This is a lite version from a project that I made time ago. It's intended to provide basic sales accountability for retail stores. I used Django for Backend and React/Typescript for the frontend. This version includes a client manager, a product manager, a report view and a point of sales app.

You can access to the testing page here: [Business Captain](https://bc-lite.lemonx.cloud/login), with user: *test* and password: *test_password*

#### Client Manager

In this section you can save information about your clients. It was design for Mexico's retail stores so the fiscal information that can be entered will be 'RFC' and 'Regimen fiscal'.

#### Product Manager

In this section you can add your products and classify them by department, category and brand.

#### Report View

In this section you can see the amount of your sales by department and by product. Also you can get a detailed report by document type.

#### Point of Sales

In this section you can capture sales and reprint tickets

### To use

In order to run this project on your computer you can clone this repository, you will need to have installed Python 3.12.0 and node 20.11.1.

You can follow the instructions on the subdirectories for frontend and backend.

#### Docker

The easiest way to run the project is using Docker. For that you need to have Docker on your computer and run:

`docker-compose -f docekrcompose.yml up`

The command above will build the images and get it running. The project will expose the port 80 so you can connect to `http://localhost`

After that you will need to run:

```
docker-compose -f docker-compose.yml exec web python manage.py migrate --noinput
docker-compose -f docker-compose.yml exec web python manage.py collectstatic --no-input
docker-compose -f docker-compose.yml exec web python manage.py create_initial_data
```

The commands above will run the migrations, collect static data and create some initial data

If you want to access the admin page, you might need to create a superuser with ` docker-compose -f docker-compose.yml exec -it web python manage.py createsuperuser`

And finally restart the services with:

```
docker-compose -f docker-compose.yml restart
```

Enjoy!
