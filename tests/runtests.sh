#!/bin/bash

cd "$(dirname "$0")"

node ../bin/player.stdio.js praxix.z5 < <(sleep 1 && echo 'all')
