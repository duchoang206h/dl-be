#!/usr/bin/expect -f
spawn ssh root@42.96.41.96
expect "Password:*"
send "tu8kDZF)lqtv\r"
#send "cd /api/livescore-api"
#send "git pull"
#send "yarn start"
interact