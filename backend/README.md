# Ardepa Carto backend

This folder contains the scripts which prepare data for the frontend.

It retrieves data from an airtable database and create local data files ready to be fetched by the frontend.

## Update mechanism

We use a per last modification date time principle.

The server keep in a text file the last update date in a text file.

The main script will only retrieve objects which has been modified after the last update date.

## data model

### map_items.json

_place info box_

### map_filters.json

_can be generated from map_items.json_
_place variable indices to filter map_

### selection_list.json

### parcours_list.json

### distinction_list.json

### lieux_id.json
