#!/usr/bin/env bash

while [ $# -gt 0 ]; do
  case "$1" in
    --version*|-v*)
      if [[ "$1" != *=* ]]; then shift; fi # Value is next arg if no `=`
      VERSION="${1#*=}"
      ;;
     --slug*|-s*)
      if [[ "$1" != *=* ]]; then shift; fi # Value is next arg if no `=`
      SLUG="${1#*=}"
      ;;
    --help|-h)
      printf "Meaningful help message" # Flag argument
      exit 0
      ;;
    *)
      >&2 printf "Error: Invalid argument\n"
      exit 1
      ;;
  esac
  shift
done

if [ -z "${VERSION}" ]
then
echo 'ℹ︎ Version not specified using develop branch'.
VERSION='develop'
pwd
fi

if [ -z "${SLUG}" ]
then
SLUG=${PWD##*/}
echo "ℹ︎ Slug not specified using $SLUG".
pwd
fi

