#!/bin/bash

cd "$(dirname "$0")"

node player.stdio.js praxix.z5 < <(sleep 1 && echo 'all')
