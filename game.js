kaboom({
global: true,
fullscreen: true,
scale: 1.5,
debug: true,
clearColor: [ 0, 0, 0, 1]
})

const MOVE_SPEED=120
const ASSETS_SPEED=40
const EVIL_SPEED=15
const NORMAL_JUMP_FORCE=360
const BIG_JUMP_FORCE=460
let JUMP_FORCE =NORMAL_JUMP_FORCE
let isJumping = true

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


scene("game",({  score })=>{
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
        "^": [sprite('evil-shroom'),solid(), 'dangerous', body()],
        "#": [sprite('brick'),solid()],
        "%": [sprite('surprise-block'),solid(),'coin-surprise'],
        "*": [sprite('surprise-block'),solid(),'mushroom-surprise'],
        "=": [sprite('block'),solid()],
        "$": [sprite('coin'),'coin'],
        "@": [sprite('mushroom'),solid(),'mushroom', body()],
        "-": [sprite('pipe-top-left'),solid(),'pipe', scale(0.5)],
        "+": [sprite('pipe-top-right'),solid(),'pipe', scale(0.5)],
        "(": [sprite('pipe-bottom-left'),solid(), scale(0.5)],
        ")": [sprite('pipe-bottom-right'),solid(), scale(0.5)]
    }
    // level config is like a sprite config, it determines the widt, height and image of each sprite


    function big() {
        let timer = 0
        let isBig = false
        return {
            update() {
                if (isBig) {
                JUMP_FORCE = BIG_JUMP_FORCE
                timer -= dt()
                if (timer <= 0) {
                    this.smallify()
                }
                }
            },
            isBig() {
                return isBig
            },
            smallify() {
                this.scale = vec2(1)
                JUMP_FORCE = NORMAL_JUMP_FORCE
                timer = 0
                isBig = false
            },
            biggify(time) {
                this.scale = vec2(1.5)
                timer = time
                isBig = true     
            }
        }
    }
    const player = add([
        sprite('mario'), 
        solid(), 
        pos(30,0),
        body(),
        big(),
        origin('bot')
    ])
    //body gives gravity to the element
    action('mushroom',(mush)=>mush.move(ASSETS_SPEED,0))
     action('dangerous',(dangerous)=>dangerous.move(-EVIL_SPEED,0))

    player.on('headbump', (obj)=>{
        if(obj.is('coin-surprise')){
            gameLevel.spawn('$', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('=', obj.gridPos.sub(0,0))
        }
        if(obj.is('mushroom-surprise')){
            gameLevel.spawn('@', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('=', obj.gridPos.sub(0,0))
        }
    })

 
    player.collides('mushroom', (mushroom) => {
        destroy(mushroom)
        player.biggify(36)
    })
    player.collides('coin', (coin) => {
        destroy(coin)
        scoreLabel.value++
        scoreLabel.text = scoreLabel.value
      
    })
    player.collides('dangerous',(dangerous)=>{
        if(isJumping){
            destroy(dangerous)
        }else{
        go('lose', { score: scoreLabel.value})
        }
    })

  player.collides('pipe', () => {
    keyPress('down', () => {
         go('win', { score: scoreLabel.value})
    
    })
  })
 

    //moving the player attaching it to keyboard events
    keyDown('left',()=>{
        player.move(-MOVE_SPEED,0)
    })
    //move( speed in x axis, speed in y axis)
    keyDown('right',()=>{
        player.move(MOVE_SPEED,0)
    })
    player.action(() => {
        if(player.grounded()) {
        isJumping = false
        }
     })
    keyDown('up',()=>{
        if(player.grounded()){
            player.jump(JUMP_FORCE)
            isJumping=true
        }
        
    })

    const gameLevel=addLevel(map, levelConfig);
    // we map the map that we draw with the spec of each sprite to make the level


    const scoreLabel= add([
        text(score),
        pos(300,6),
        layer("ui"),
        {
            value: score
        }
    ])
    add([text("Welcome"), pos(4,6)])
})

scene('lose', ({ score }) => {
  add([text(`Total score: ${score}`, 32), origin('center'), pos(width()/2, height()/ 2)])
})
scene('win', ({ score }) => {
     add([text(`Congratulations!!`, 32), origin('center'), pos(width()/2, (height()/ 2)-50)])
  add([text(`Total score: ${score}`, 32), origin('center'), pos(width()/2, height()/ 2)])
})
start ("game",{  score: 0})

