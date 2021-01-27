#!/usr/bin/env python3

'''
Renders available pre-packaged screen apps as a Gatsby Markup table.
'''
from urllib import request
def app_anchor(app_type, app_name):
    return '/#spring-cloud-stream-modules-' + app_name + '-' +app_type

def app_link(app_name, anchor):
    if anchor:
        return '[' + app_name + ']' + '(%stream-applications-doc-2x%' + anchor  + ')' #change the variable reference accordingly.
    return app_name

def render_row(items, anchor = False):
    row = '|'
    app_types=('source','processor','sink')
    for i in range(len(items)):
        if len(items[i]) > 0:
            app_type=app_types[i]
            item = app_link(items[i], app_anchor(app_type,items[i])) if anchor else items[i]
        else:
            item=''
        row = row + ' ' + item + ' |'
    return row

def render(apps):
    print(render_row(['Source','Processor','Sink'], None))
    print(render_row(['-'*10,'-'*10,'-'*10], None))
    sources = apps['source']
    processors = apps['processor']
    sinks = apps['sink']
    for i in range(max(len(sources),len(processors),len(sinks))):
        source = sources[i] if i < len(sources)  else ''
        processor = processors[i] if i < len(processors) else ''
        sink = sinks[i] if i < len(sinks)  else ''
        print(render_row((source,processor,sink), True))

source_for_stream_apps_metadata = "https://dataflow.spring.io/rabbitmq-maven-einstein"  #change this link accordingly.
metadata = request.urlretrieve(source_for_stream_apps_metadata)
lines = open(metadata[0], 'r').readlines()

app_data = list(filter(lambda line: 'metadata' not in line, map(lambda line: line.split('=')[0].split('.'), lines)))
apps = {}
for app in app_data:
    if (len(app) == 2):
        if not apps.get(app[0]):
            apps[app[0]] = []
        apps[app[0]].append(app[1])

render(apps)
