#!/bin/bash
set -u
cd "$(dirname "$0")"

PROJECTS=(
  "diocese-of-guildford-education-centre-stag-hill"
  "station-road-addlestone"
  "guildford-lido"
  "church-street-effingham"
  "two-new-surrey-homes"
  "cedar-centre-guildford"
  "young-epilepsy-scanning-facility"
  "young-epilepsy-residential-units"
  "private-house-guildford-2"
  "estate-cottage-refurbishment"
  "young-epilepsy-lingfield"
  "residential-development-walton-on-the-hill"
  "private-house-surrey-hills"
  "the-old-rectory"
  "salesian-school-chertsey"
  "gastropub-egham"
  "planning-approval-for-new-build-dwelling-in-green-belt-of-surrey"
  "design-for-the-barn-house-guildford"
  "residential-development-epsom"
  "welland-house-guildford"
)

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

# Project-specific CDN bucket (excludes favicon/site assets in 65d5d30c... and 65e0673d...)
BUCKET="65e71ad05ff5e699cc1ea7db"

for slug in "${PROJECTS[@]}"; do
  echo "==> $slug"
  mkdir -p "$slug"
  url="https://lytle-associates.com/projects/$slug"
  html=$(curl -sL -A "$UA" "$url")
  # Extract image URLs from the project bucket
  echo "$html" \
    | grep -oE "https://cdn\.prod\.website-files\.com/${BUCKET}/[^\"' )]+\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)" \
    | sort -u \
    | while read -r imgurl; do
        fname=$(basename "$imgurl" | sed 's/%20/_/g')
        if [ -s "$slug/$fname" ]; then
          echo "  skip $fname"
          continue
        fi
        echo "  get  $fname"
        curl -sL -A "$UA" -o "$slug/$fname" "$imgurl"
      done
done

echo "Done."
ls -la
