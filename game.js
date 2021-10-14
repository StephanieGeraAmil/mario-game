kaboom({
global: true,
fullscreen: true,
scale: 1,
debug: true,
clearColor: [ 0, 0, 0, 1]
})



loadRoot('https://i.imgur.com/')
loadSprite('coin','wbKxhcd.png')
loadSprite('evil-shroom','KPO3fR9.png')
loadSprite('brick','pogC9x5.png')
loadSprite('surprise-block','gesQ1KP.png')
loadSprite('block','bdrLpi6.png')
loadSprite('mario','Wb1qfhK.png')
loadSprite('mushroom','0wMd92p.png')
loadSprite('pipe-top-left','ReTPiWY.png')
loadSprite('pipe-top-right','hj2GK4n.png')
loadSprite('pipe-bottom-left','c1cYSbt.png')
loadSprite('pipe-bottom-right','nqQ79eI.png')


scene("game",()=>{
    layers(["bg","obj","ui"],'obj')
    const map=[
        '                                               ',
        '                                               ',
        '                                               ',
        '                                               ',
        '                                               ',
        '                                               ',
        '                                               ',
        '                                               ',
        '                                               ',
        '                                               ',
        '                                               ',
        '                                               ',
        '                                               ',
        '                                               ',
        '                                               ',
        '                                               ',
        '                                               ',
        '                                        $      ',
        '                                     $    $    ',
        '                                               ',
        '                             #####             ',
        '                                               ',
        '       %           ##*##%##                    ',
        '                                               ',
        '                                            -+ ',
        '                    ^             ^         () ',
        '##############  ###############  ##############',
    ]
    const levelConfig={
        width:20,
        height: 20,
        "^": [sprite('evil-shroom'),solid()],
        "#": [sprite('brick'),solid()],
        "%": [sprite('surprise-block'),solid(),'coin-surprise'],
        "*": [sprite('surprise-block'),solid(),'mushroom-surprise'],
        "=": [sprite('block'),solid()],
        "$": [sprite('coin'),solid()],
        "@": [sprite('mushroom'),solid()],
        "-": [sprite('pipe-top-left'),solid(), scale(0.5)],
        "+": [sprite('pipe-top-right'),solid(), scale(0.5)],
        "(": [sprite('pipe-bottom-left'),solid(), scale(0.5)],
        ")": [sprite('pipe-bottom-right'),solid(), scale(0.5)]
    }
    // level config is like a sprite config, it determines the widt, height and image of each sprite
    const player = add([
        sprite('mario'), solid(), 
        pos(30,0),
        body(),
        origin('bot')
    ])
    //body gives gravity to the element

    const MOVE_SPEED=120
    const JUMP_FORCE=300

    //moving the player attaching it to keyboard events
    keyDown('left',()=>{
        player.move(-MOVE_SPEED,0)
    })
    //move( speed in x axis, speed in y axis)
    keyDown('right',()=>{
        player.move(MOVE_SPEED,0)
    })
    keyDown('up',()=>{
        if(player.grounded()){
            player.jump(JUMP_FORCE)
        }
        
    })

    const gameLevel=addLevel(map, levelConfig);
    // we map the map that we draw with the spec of each sprite to make the level


    const scoreLabel= add([
        text("score"),
        pos(300,6),
        layer("ui"),
        {
            value: "score"
        }
    ])
    add([text("Welcome"), pos(4,6)])
})
start ("game")

