const tetris_manager = new TetrisManager(document);
const localtetris = tetris_manager.create_player();
const connection_manager = new ConnectionManager(tetris_manager);
connection_manager.connect("ws://localhost:9000");
localtetris.element.classList.add('local');


const keylistener = (event) => {
    [
        [37, 39, 38, 40],
        [65, 68, 87, 83],
    ].forEach((key, index) => {
        const player = localtetris.player;
        if (event.type === 'keydown') {
            if (event.keyCode === key[0]) {
                player.move(-1);
            } else if (event.keyCode === key[1]) {
                player.move(+1);
            } else if (event.keyCode === key[2]) {
                player.rotate(-1);
            }
        }
        if (event.keyCode === key[3]) {
            if (event.type === 'keydown') {
                if (player.dropInterval !== player.drop_fast) {
                    player.drop();
                    player.dropInterval = player.drop_fast;
                }
            } else {
                player.dropInterval = player.drop_slow;
            }
        }

    });

};

document.addEventListener('keydown', keylistener);
document.addEventListener('keyup', keylistener);