#!/bin/bash

podman build -t web-master-erp-rc .
podman run -d --name database -p 27027:27017 mongo 
podman run -d --name master --network container:database -p 3000:3000 -p 3001:3001 -p 27017:27017 web-master-erp-rc 
