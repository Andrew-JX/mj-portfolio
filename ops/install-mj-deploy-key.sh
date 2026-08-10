#!/usr/bin/env bash
set -Eeuo pipefail

readonly public_key_file="${1:-}"
readonly authorized_keys='/home/ubuntu/.ssh/authorized_keys'
readonly key_comment='github-actions-mj-portfolio'
readonly forced_command='command="/usr/local/sbin/deploy-mj-portfolio",restrict'

test -s "$public_key_file"
public_key="$(tr -d '\r\n' < "$public_key_file")"

if [[ ! "$public_key" =~ ^ssh-ed25519\ [A-Za-z0-9+/=]+\ github-actions-mj-portfolio$ ]]; then
  echo 'Unexpected deployment public key format.' >&2
  exit 65
fi

install -d -m 700 /home/ubuntu/.ssh
touch "$authorized_keys"
chmod 600 "$authorized_keys"

if ! grep -q "${key_comment}$" "$authorized_keys"; then
  printf '%s %s\n' "$forced_command" "$public_key" >> "$authorized_keys"
fi

test "$(grep -c "${key_comment}$" "$authorized_keys")" -eq 1
rm -f -- "$public_key_file"
echo 'RESTRICTED_PUBLIC_KEY_INSTALLED'
