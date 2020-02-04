


const checkPriviledges  = () => {
	return function(req, res, next) {
		if(req.headers['user-agent'] == req.user['userAgent'] && ((req.headers['x-forwarded-for'] || req.connection.remoteAddress) == req.user['IP']))
		{
			next()
			
		}
		else
		{
			res.json({success: false, message: 'Invalid Token'})
		}		
	}
}


module.exports = checkPriviledges