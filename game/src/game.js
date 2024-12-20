//enchant.js本体やクラスをエクスポートする
enchant();

//ページが読み込まれた時に実行される関数
window.onload = function(){

    //ゲームオブジェクト作成
    core = new Core(320,420);

    //ゲームの初期化処理
    //fpsの設定
    core.fps = 24;
    core.step1=100
    core.step2=500

    //ゲームのスコアの変数
    core.score = 0;
    //ハイスコア用の変数
    core.hi_score = 0;
    //ライフ
    core.life = 3;
    //ウエイトのカウンタ
    core.wait = 0;
    //自機の死亡フラグ
    core.death = false;
    //ゲームオーバーのフラグ
    core.over = false;
    //事前読み込み
    core.preload('pics/player.png','pics/playerM.png','pics/playerL.png','pics/bg3.png','pics/enemys0.png','pics/tama0.png','pics/tama1.png','pics/tama2.png','pics/ex.png','pics/but.png');

    //変数
    //アニメーション用の変数
    tick = 0;
    tick_ani = 0;
    
    //セーブ関連
    enchant.nineleap.memory.LocalStorage.DEBUG_MODE = true;
    //ゲームIDを設定
    enchant.nineleap.memory.LocalStorage.GAME_ID = 'shooting01';
    //自分のデータを読み込み
    core.memory.player.preload();
    

    //ファイルのプリロードが完了したときに実行される関数-----------------------------------------------------------------
    core.onload = function(){
        
        //背景作成
        background = new Backgroud();

        //操作画面の背景
        var backbg = new Sprite(320,100);
        backbg.x = 0;
        backbg.y = 320;
        backbg.backgroundColor = "#2E2E2E"
        core.rootScene.addChild(backbg);

        //スコアラベル作成
        var scoreLabel = new ScoreLabel(5, 0);
        scoreLabel.score = 0;
        scoreLabel.easing = 0;
        core.rootScene.addChild(scoreLabel);

        //ライフラベル作成
        var lifeLabel = new LifeLabel(180, 0, 3);
        core.rootScene.addChild(lifeLabel);

        //敵を格納する配列
        enemies = [];

        
        //player作成
        player = new Player(144,138);

        //操作ボタン
        var pad = new Pad();
        pad.x = 0;
        pad.y = 320;
        core.rootScene.addChild(pad);

        //操作ボタン、攻撃
        var button = new Button(240,340,);

        //saveデータ削除
        var dellabel = new MutableText(130,360);
        dellabel.addEventListener('touchstart',function(e){
           this.backgroundColor = '#FFFFFF';
        });
        dellabel.addEventListener('touchend',function(e){
           this.backgroundColor = '';
           localStorage.removeItem('game_shooting01_user_mine');
        });
        core.rootScene.addChild(dellabel);
        
        //rootSceneのmain処理===========================================================================================
        core.rootScene.addEventListener('enterframe', function(){

            //アニメーション用のカウンターの処理
            tick ++;
            if(tick >= 3){
                tick = 0;
                tick_ani ++;
            }

            //敵の生成処理
            if(rand(100) < 15 && core.death == false){
                var enemy = new Enemy(rand(320), 0, rand(4));
                enemy.id = core.frame;
                enemies[enemy.id] = enemy;
            }

            //スコア更新
            scoreLabel.score = core.score;
            //ライフの更新
            lifeLabel.life = core.life;
            //ゲームオーバーなら終了
            if(core.over){
                core.end();
            }

            //被弾処理
            if(core.death == true){
                core.wait ++;
                player.visible = player.visible ? false : true;
                if(core.wait == core.fps * 5){
                    core.death = false;
                    player.visible = true;
                    core.wait = 0;
                }
            }
        });
        //================================================================================================================
        
        
    }
    //-----------------------------------------------------------------------------------------------------------------------
    //ゲーム開始
    core.start();
}


//playerクラスの作成
var Player = enchant.Class.create(enchant.Sprite,{
    initialize: function(x,y){
        enchant.Sprite.call(this, 32, 41);
        //サーフィスを作成
        var image = new Surface(128,41);
        var image2 = new Surface(128,41);
        var image3 = new Surface(128,41);
        image.draw(core.assets['pics/player.png'], 0, 0, 128, 41, 0, 0, 128, 41);
        this.image = image;
        this.frame = 0;
        this.x = x;
        this.y = y;
        this.speed = 9;
        this.shotflag = false;
        //イベントリスナ
        this.addEventListener('enterframe', function(){
            //画像変更
            if (core.score <= core.step1){
                image.draw(core.assets['pics/player.png'], 0, 0, 128, 41, 0, 0, 128, 41);
                this.image = image;
                }
                else if (core.score > core.step1 && core.score <= core.step2 ){
                    image2.draw(core.assets['pics/playerM.png'], 0, 0, 128, 41, 0, 0, 128, 41);
                    this.image = image2;
                }
                else{
                    image3.draw(core.assets['pics/playerL.png'], 0, 0, 128, 41, 0, 0, 128, 41);
                    this.image = image3;
                }

            //移動処理
            if(core.input.left && this.x >= 0){
                this.x -= this.speed;
                this.frame = 3;
            }

            if(core.input.right && this.x <= core.width - 32){
                this.x += this.speed;
                this.frame = 2;
            }

            if(core.input.up && this.y >= 0){
                this.y -= this.speed;
                this.frame = 0;
            }

            if(core.input.down && this.y <= core.height - 140){
                this.y += this.speed;
                this.frame = 1;
            }
        });
        core.rootScene.addChild(this);
    }
});

//backgroundクラス
var Backgroud = enchant.Class.create(enchant.Sprite,{
    initialize: function(){
        enchant.Sprite.call(this, 320, 640);
        this.x = 0;
        this.y = -320;
        this.frame = 0;
        this.image = core.assets['pics/bg3.png'];

        this.addEventListener('enterframe', function(){
            //背景のスクロール処理
            this.y ++;
            if(this.y >= 0){
                this.y = -320;
            }
        });
        core.rootScene.addChild(this);
    }
});

//enemyクラス
var Enemy = enchant.Class.create(enchant.Sprite,{
    initialize: function(x, y, type){
        enchant.Sprite.call(this, 32, 32);
        this.image = core.assets['pics/enemys0.png'];
        this.x = x;
        this.y = y;
        this.vx = 4;    //x方向の移動の速度
        this.type = type;   //敵の種類のプロパティ
        //いったん落ちたらプレイヤーが離れても落ちてくるためのフラグ
        this.flag = false;
        //弾ようのフレームカウント
        this.tick = 0;
        //弾の発射角度用の変数
        this.angle = 0;

        this.addEventListener('enterframe', function(){
            //敵のタイプごとの移動等の記載
            //タイプ0 回転しながらゆっくりしたに来る
            if(this.type == 0){
                this.frame = 8 + tick_ani % 4;
                this.y += 3;
            }

            //タイプ1 早く落ちてくる
            if(this.type == 1){
                this.frame = 4 + tick_ani % 3;
                this.y += 6;
            }

            //タイプ２　横移動の後に落ちてくる
            if(this.type == 2){
                
                this.frame = tick_ani % 3;
                if(this.x < player.x - 45 && this.flag == false){
                    this.x += this.vx;
                }
                else if(this.x > player.x + 45 && this.flag == false){
                    this.x -= this.vx;
                }
                else{
                    this.flag = true;
                    this.vx = 0;
                    this.y += 9;
                }
            }
            //タイプ３ 横移動の後落ちて、キャラが離れるとそこで止まってちかずくのを待っている
            if(this.type == 3){
                
                this.frame = 12 + tick_ani % 3;
                if(this.x < player.x - 64 ){
                    this.x += this.vx;
                }
                else if(this.x > player.x + 64 ){
                    this.x -= this.vx;
                }
                else{
                    this.vx = 0;
                    this.y += 8;
                }
            }

            //playerとのあたり判定
            if(player.within(this, 25) && core.death == false){
                var effect = new Explosion(player.x, player.y, 0);
                core.death = true;
                player.visible = false;
                //ライフを減らす
                core.life --;
                //ライフが０になればゲームオーバー
                if(core.life == 0){
                    core.over = true;
                }
            }

            //画面の外に出たら
            if(this.y > 280 || this.x > 320 || this.x < - this.width || this.y < -this.height){
                this.remove();
            }else if(this.tick++ % 32 == 0){
            }
        });
        core.rootScene.addChild(this);
    },
    //敵を消すメソッド
    remove: function(){
        core.rootScene.removeChild(this);
        delete enemies[this.id];
        delete this;
    }
});

//弾のクラス
var Bullet = enchant.Class.create(enchant.Sprite,{
    initialize: function(x, y, angle){
        enchant.Sprite.call(this, 24, 27);
        var image = new Surface(96,27);
        var image2 = new Surface(96,27);
        var image3 = new Surface(96,27);
        image.draw(core.assets['pics/tama0.png']);
        this.image = image;
        this.x = x-6;
        this.y = y;
        this.angle = angle;
        this.speed = 10;

        this.addEventListener('enterframe',function(){
//画像変更
if (core.score <= core.step1){
    image.draw(core.assets['pics/tama0.png'], 0, 0, 128, 41, 0, 0, 128, 41);
    this.image = image;
    }
    else if (core.score > core.step1 && core.score <= core.step2 ){
        image2.draw(core.assets['pics/tama1.png'], 0, 0, 128, 41, 0, 0, 128, 41);
        this.image = image2;
    } else {
        image3.draw(core.assets['pics/tama2.png'], 0, 0, 128, 41, 0, 0, 128, 41);
        this.image = image3;
    }



            //弾の移動処理
            this.x += this.speed * Math.sin(this.angle);
            this.y += this.speed * Math.cos(this.angle);

            //画面の外に出たら消去
            if(this.y > 300 || this.x > 320 || this.x < - this.width || this.y < -this.height){
                this.remove();
            }
        });
        core.rootScene.addChild(this);
    },
    remove: function(){
        core.rootScene.removeChild(this);
        delete this;
    }
});

//プレイヤーの弾のクラス、Bulletクラスを継承
var PlayerBullet = enchant.Class.create(Bullet,{
    initialize: function(x ,y){
        Bullet.call(this, x, y, Math.PI);
        this.frame = 1;

        this.addEventListener('enterframe',function(){
            this.frame = tick_ani % 4;
            //敵とのあたり判定
            for(var i in enemies){
                //敵にあたったとき
                if(enemies[i].intersect(this)){
                    //爆発表示
                    var effect = new Explosion(enemies[i].x ,enemies[i].y - enemies[i].height / 2, 1);
                    //敵を消去
                    enemies[i].remove();
                    core.score += (10 + rand(6));
                }
            }
        });
    }
});

//敵の弾のクラス、Bulletクラスを継承
var EnemyBullet = enchant.Class.create(Bullet,{
    initialize: function(x, y, angle){
        Bullet.call(this, x, y, angle);
        this.speed = 6;
        this.frame = 4;

        this.addEventListener('enterframe',function(){
                //プレイヤーとのあたり判定
                if(player.within(this, 8) && core.death == false){
                    var effect = new Explosion(player.x, player.y, 0);
                    core.death = true;
                    player.visible = false;
                    //ライフを減らす
                    core.life --;
                    //ライフが０になればゲームオーバー
                    if(core.life == 0){
                        core.over = true;
                    }
                }
        });
    }
});

//爆発クラス
var Explosion = enchant.Class.create(enchant.Sprite,{
    initialize: function(x, y, ex_ani){
        enchant.Sprite.call(this,32, 32);
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.image = core.assets['pics/ex.png'];
        this.tick = 0;

        this.addEventListener('enterframe', function(){
            //爆発アニメ自機
            if(ex_ani == 0){
                this.frame = 6 + tick_ani % 6;
                if(this.frame == 11){
                    this.remove();
                }
            }
            if(ex_ani == 1){
                this.frame = tick_ani % 6;
                if(this.frame == 5){
                    this.remove();
                }
            }
        });
        core.rootScene.addChild(this);
    },
    remove: function(){
        core.rootScene.removeChild(this);
        delete this;
    }
});

//ボタンクラス
var Button = enchant.Class.create(enchant.Sprite,{
    initialize: function(x , y){
        enchant.Sprite.call(this, 48,48);
        this.image = core.assets['pics/but.png'];
        this.x = x;
        this.y = y;
        
        this.addEventListener('touchstart',function(){
            //playerからの弾の発射の処理
            var s = new PlayerBullet(player.x + 12, player.y - 12);
        })

        core.rootScene.addChild(this);
    }
});
