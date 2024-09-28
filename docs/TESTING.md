# Testing

## For running unit tests
```
make test-unit
```

## For running intergration tests

Prerequisite:
* Install and run [docker](https://docs.docker.com/engine/install/)
```
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```
* Add docker user to sudo group
```
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

```
make test-integration
```
Integration tests can be found in : test/e2e