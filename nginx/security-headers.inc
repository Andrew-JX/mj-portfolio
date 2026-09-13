# nginx 的 add_header 不做跨层继承：location 里只要出现自己的 add_header，
# server 层的安全头就全部失效。凡是自带 add_header 的 location，必须再 include 一次本文件。
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
