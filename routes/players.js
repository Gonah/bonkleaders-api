var express = require('express');
var router = express.Router();
var request = require("request");
var unirest = require("unirest");

/* GET users listing. */
router.get('/', function(req, res, next) {

    
  res.send('players resource');
});

router.get('/:name', function(req, res, next) {
    var name = req.params.name

    unirest.post('http://www.multiplayer.gg/physics/scripts/verifyxp.php')
    .headers({'cache-control': 'no-cache',
    'accept': '*/*',
    'content-type': 'application/x-www-form-urlencoded',
    'accept-language': 'en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7',
    'accept-encoding': 'gzip, deflate'})
    .send("ignorethis=8205&usernamelist="+name+"&basePasswordString=77564898")
    .end(function (response) {
        console.log(response);
        var resString = response.body
        var params = resString.split("&")
        var uglyPlayer = {};
        for (var i = 0, len = params.length; i < len; i++) {
            var keyvalue = params[i].split("=");
            uglyPlayer[keyvalue[0]] = keyvalue[1];
        }
        if(uglyPlayer.xp0 == -1)
            return res.status(404).send();

        var xp = parseInt(uglyPlayer.xp0); //Calculations for the XP self-explanitory mainly
        var lvl = Math.ceil(Math.sqrt(xp)/10);
        var nextlvl = Math.pow(lvl*10, 2);
        var lastlvl = Math.pow((lvl - 1)*10, 2);
        var currentLevelXP = xp - lastlvl;
        var maxLevelXP = nextlvl - lastlvl;
        var percent = ((currentLevelXP / maxLevelXP) * 100).toFixed(1) + '%';
        var wins = xp / 50;

        var player = {
            name: uglyPlayer.username0,
            totalXP: xp,
            currentLevel: lvl,
            nextLevel: nextlvl,
            lastLevel: lastlvl,
            currentLevelXP: currentLevelXP,
            maxLevelXP: maxLevelXP,
            percent: percent,
            wins: wins
        };
      console.log(response.body);
      res.send(player);
    });
  });


module.exports = router;
