run:  stop down up
build: stop down up-rebuild
deploy: firebase gcr cloudrun
local: local-build local-docker local-up
test: local-test local-coverage

up:
	docker-compose up --remove-orphans

up-rebuild:
	docker-compose up --build --remove-orphans

web:
	docker-compose -f docker-compose-web.yml up --build --remove-orphans

stop:
	docker-compose stop

down:
	docker-compose down

gcr:
	docker tag be-portfolio gcr.io/backendsvc/be-portfolio && docker push gcr.io/backendsvc/be-portfolio

cloudrun:
	gcloud run deploy be-portfolio --image gcr.io/backendsvc/be-portfolio --platform managed --region us-west1

firebase:
	firebase deploy --only hosting

local-test:
	export GO111MODULE=on; \
	cd ./cmd/be-portfolio; \
	go test -covermode=count -coverprofile=coverage.txt

local-coverage:
	export GO111MODULE=on; \
	cd ./cmd/be-portfolio; \
	go tool cover -func=coverage.txt

local-build:
	export GO111MODULE=on; \
	cd ./cmd/be-portfolio; \
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main . 

local-docker:
	cd ./cmd/be-portfolio; \
	docker build -t be-portfolio -f Dockerfile.mac .

local-up:
	docker-compose -f docker-compose.local.yml up 

local-logs:
	docker-compose -f docker-compose.local.yml logs

data:
	curl https://backendsvc.web.app/api/ > ./cmd/www_static/data.json

local-data:
	curl http://localhost:8080/api/ > ./cmd/www_static/data.json
	