express   = require 'express'
app = express()
router = require('../web/').connect({host: '10.162.196.27', password: 'bEGGA-55376'})
app.use('/fairy', router)

app.listen 8765
console.log "'fairy-web' is running at http://0.0.0.0:8765"
