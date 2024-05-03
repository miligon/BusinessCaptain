# Builder for node dependencies
FROM node:20.11.1-alpine3.19 as frontend_deps

RUN mkdir /frontend_builder
COPY ./frontend/package.json /frontend_builder/package.json
WORKDIR /frontend_builder
RUN npm install

# Builder for frontend dist files
FROM node:20.11.1-alpine3.19 as frontend_builder

RUN mkdir /frontend_builder
COPY ./frontend /frontend_builder
RUN rm -rf /frontend_builder/node_modules
RUN rm -rf /frontend_builder/dist
COPY --from=frontend_deps /frontend_builder/node_modules /frontend_builder/node_modules
WORKDIR /frontend_builder
# Build dist files
RUN npm run build
# Create template dir for django serving
RUN mkdir /frontend_builder/dist/templates
RUN mv /frontend_builder/dist/static/react/index.html /frontend_builder/dist/templates/index_react.html

# Final Image
FROM python:3.12.0-slim

ENV PYTHONUNBUFFERED 1
RUN mkdir /backend
RUN mkdir /backend/static
RUN mkdir /backend/media

RUN mkdir /react
COPY --from=frontend_builder /frontend_builder/dist/ /react

COPY ./backend/requirements.txt /backend
RUN apt-get update && apt-get install -y pkg-config gcc default-libmysqlclient-dev pkg-config
RUN pip install --no-cache-dir -r /backend/requirements.txt
WORKDIR /backend

