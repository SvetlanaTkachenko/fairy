{exec} = require 'child_process'

task      = process.argv[2]
fairy     = require("#{__dirname}/../..").connect()
queue     = fairy.queue task

queue.regist (group, sequence, callback) ->
