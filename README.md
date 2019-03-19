# Big Brother

## Requirements

[Docker](https://docs.docker.com/install/)

[Docker Compose](https://docs.docker.com/compose/install/)

## Development

### Preparation

```bash
ln -s docker-compose.dev.yml docker-compose.yml
echo "DOCKER_USER=$UID" > .env
```

### Usage

```bash
docker-compose build    # To build
docker-compose up -d    # To up containers
docker-compose down     # To down containers
docker-compose down -v  # To down containers without saving data
```
