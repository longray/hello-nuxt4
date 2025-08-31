@echo off
rem 文件名：sqlite3-fk.cmd
rem 作用：自动打开外键约束后启动 sqlite3
sqlite3.exe -cmd "PRAGMA foreign_keys = ON;" %*