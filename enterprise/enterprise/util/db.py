#encoding=utf-8
from DBUtils.PersistentDB import PersistentDB
import MySQLdb

# Mysql db pool
dbpool = PersistentDB(creator=MySQLdb, maxusage=1000, host='127.0.0.1', user='root', passwd='', port=3306, db='startup', charset='utf8')
