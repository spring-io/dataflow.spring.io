#!/bin/bash

rm -Rf cloud-foundry/public
cp -r public cloud-foundry/public
cf push
cf map-route dataflow-website-staging cfapps.io --hostname dataflow-preview
cf unmap-route dataflow-website-staging cfapps.io --hostname dataflow-staging

cf unmap-route dataflow-website-preview cfapps.io --hostname dataflow-preview

cf delete -f dataflow-website-preview
cf rename dataflow-website-staging dataflow-website-preview

