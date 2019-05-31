#!/bin/bash

./prepare-cf-push.sh

cf push
cf map-route dataflow-website-staging spring.io --hostname dataflow
cf map-route dataflow-website-staging cfapps.io --hostname dataflow
cf unmap-route dataflow-website-staging cfapps.io --hostname dataflow-staging

cf unmap-route dataflow-website spring.io --hostname dataflow
cf unmap-route dataflow-website cfapps.io --hostname dataflow

cf delete -f dataflow-website
cf rename dataflow-website-staging dataflow-website

