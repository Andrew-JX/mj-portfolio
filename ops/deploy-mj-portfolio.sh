#!/usr/bin/env bash
set -Eeuo pipefail

export PATH='/usr/sbin:/usr/bin:/sbin:/bin'
unset BASH_ENV ENV CDPATH

readonly current='/var/www/mj-portfolio'
readonly max_archive_megabytes=25
readonly max_extracted_bytes=33554432
readonly max_members=2000

original_command="${SSH_ORIGINAL_COMMAND:-}"
if [[ "$original_command" =~ ^deploy\ ([0-9a-f]{40}-[0-9]+-[0-9]+)$ ]]; then
  release_id="${BASH_REMATCH[1]}"
else
  echo 'Only a validated mj-portfolio deployment is allowed.' >&2
  exit 64
fi

readonly release_id
readonly release="/var/www/mj-portfolio-release-${release_id}"
readonly backup="/var/www/mj-portfolio-backup-${release_id}"
readonly failed="/var/www/mj-portfolio-failed-${release_id}"
archive="$(mktemp /tmp/mj-portfolio-upload-XXXXXXXX.tar.gz)"
readonly archive
swapped=0

cleanup() {
  rm -f -- "$archive"
}

rollback() {
  status=$?
  trap - ERR
  if [[ "$swapped" == '1' && -d "$backup" ]]; then
    sudo mv "$current" "$failed"
    sudo mv "$backup" "$current"
    sudo systemctl reload nginx || true
  fi
  cleanup
  exit "$status"
}

trap cleanup EXIT
trap rollback ERR

dd bs=1M count="$max_archive_megabytes" iflag=fullblock status=none > "$archive"
test -s "$archive"

python3 - "$archive" "$max_extracted_bytes" "$max_members" <<'PY'
import pathlib
import sys
import tarfile

archive_path = sys.argv[1]
max_bytes = int(sys.argv[2])
max_members = int(sys.argv[3])

with tarfile.open(archive_path, mode="r:gz") as archive:
    members = archive.getmembers()
    if len(members) > max_members:
        raise SystemExit("Archive contains too many entries")

    total_size = 0
    for member in members:
        path = pathlib.PurePosixPath(member.name)
        if path.is_absolute() or ".." in path.parts:
            raise SystemExit("Archive contains an unsafe path")
        if member.issym() or member.islnk() or member.isdev():
            raise SystemExit("Archive contains a disallowed entry type")
        total_size += member.size

    if total_size > max_bytes:
        raise SystemExit("Archive expands beyond the deployment limit")
PY

test -d "$current"
test ! -e "$release"
test ! -e "$backup"
test ! -e "$failed"

sudo install -d -o ubuntu -g ubuntu -m 0755 "$release"
tar -xzf "$archive" -C "$release" --no-same-owner --no-same-permissions
test -s "$release/index.html"
test -d "$release/assets"
grep -q '苏ICP备2026054660号-1' "$release/index.html"
chmod -R a+rX "$release"

sudo mv "$current" "$backup"
sudo mv "$release" "$current"
swapped=1

sudo nginx -t
sudo systemctl reload nginx
curl --fail --silent --show-error --retry 3 --retry-delay 2 \
  https://mj.jimmyuuu.com/ | grep -q '苏ICP备2026054660号-1'

trap - ERR
echo "DEPLOY_OK ${release_id}"
