---
path: 'feature-guides/streams/labels/'
title: 'Labeling Applications'
description: 'How to label stream applications'
---

# Labeling Applications

When a stream is made up of multiple apps with the same name, they must be qualified with labels so they can be uniquely identified:

````
stream create --definition "http | firstLabel: transform --expression=payload.toUpperCase() | secondLabel: transform --expression=payload+'!' | log" --name myStreamWithLabels --deploy```
````

This can be visualised in a graphical representation as follows:

![Stream Labels](images/stream-labels.png)
